import { describe, it } from 'node:test';
import { readFileSync } from 'fs';
import assert from 'node:assert/strict';
import { deepEqual } from '../utils/assert.js';
import { MwContextualizer, Normalizer, Parser } from '../../lib/lineardoc/index.js';
import { isIgnorableBlock } from '../../lib/lineardoc/Utils.js';
import transTests from './translate.test.json' assert { type: 'json' };

const dirname = new URL( '.', import.meta.url ).pathname;
function normalize( html ) {
	const normalizer = new Normalizer();
	normalizer.init();
	normalizer.write( html.replace( /(\r\n|\n|\t|\r)/gm, '' ) );
	return normalizer.getHtml();
}

describe( 'LinearDoc', () => {
	it( 'should be possible to linearise all kind of HTML inputs', () => {
		const numTests = 8;
		for ( let i = 1; i <= numTests; i++ ) {
			const testXhtmlFile = dirname + '/data/test' + i + '.xhtml';
			const resultXmlFile = dirname + '/data/test' + i + '-result.xml';
			const resultXhtmlFile = dirname + '/data/test' + i + '-result.xhtml';
			const testXhtml = readFileSync( testXhtmlFile, 'utf8' ).replace( /^\s+|\s+$/, '' );
			const expectedXml = readFileSync( resultXmlFile, 'utf8' ).replace( /^\s+|\s+$/, '' );
			const expectedXhtml = readFileSync( resultXhtmlFile, 'utf8' ).replace( /^\s+|\s+$/, '' );
			const parser = new Parser( new MwContextualizer() );
			parser.init();
			parser.write( testXhtml );
			assert.ok( !isIgnorableBlock( parser.builder.doc ), 'Not a section with block template' );
			deepEqual(
				normalize( parser.builder.doc.dumpXml() ),
				normalize( expectedXml ),
				'Linearised structure'
			);
			deepEqual(
				normalize( parser.builder.doc.getHtml() ),
				normalize( expectedXhtml ),
				'Reconstructed XHTML'
			);
		}
	} );

	it( 'should be possible to reconstruct the HTML from LinearDoc', () => {
		for ( let i = 0, len = transTests.length; i < len; i++ ) {
			const test = transTests[ i ];
			const parser = new Parser( new MwContextualizer() );
			parser.init();
			parser.write( '<div>' + test.source + '</div>' );
			const textBlock1 = parser.builder.doc.items[ 1 ].item;
			deepEqual(
				textBlock1.getHtml(),
				test.source,
				'Reconstructed source HTML'
			);
			const textBlock2 = textBlock1.translateTags(
				test.targetText,
				test.rangeMappings
			);
			deepEqual(
				textBlock2.getHtml(),
				test.expect,
				'Translated HTML'
			);
		}
	} );

	it( 'should be possible to reduce and expand a document', () => {
		const testXhtmlFile = dirname + '/data/test-figure-inline.html';
		const contentForReduce = readFileSync( testXhtmlFile, 'utf8' ).replace( /^\s+|\s+$/, '' );
		const parser = new Parser( new MwContextualizer() );
		parser.init();
		parser.write( contentForReduce );
		const { reducedDoc, extractedData } = parser.builder.doc.reduce();
		deepEqual( Object.keys( extractedData ).length, 16, 'Attributes for 16 tags extracted.' );
		const expandedDoc = reducedDoc.expand( extractedData );
		deepEqual(
			normalize( expandedDoc.getHtml() ),
			normalize( contentForReduce ),
			'Restored the original html after reduce and expand.'
		);
	} );

	it( 'test HTML compaction roundtrip with inline chunks', () => {
		const testXhtmlFile = dirname + '/data/test-chunks-inline.html';
		const contentForReduce = readFileSync( testXhtmlFile, 'utf8' ).replace( /^\s+|\s+$/, '' );
		const parser = new Parser( new MwContextualizer() );
		parser.init();
		parser.write( contentForReduce );
		const { reducedDoc, extractedData } = parser.builder.doc.reduce();
		deepEqual( Object.keys( extractedData ).length, 22, 'Attributes for 22 tags extracted.' );
		const expandedDoc = reducedDoc.expand( extractedData );
		deepEqual(
			normalize( expandedDoc.getHtml() ),
			normalize( contentForReduce ),
			'Restored the original html after reduce and expand.'
		);
	} );

	it( 'test HTML expand with external attributes inserted', () => {
		const corruptedDoc = `<p id="1">
			<b id="2" onclick="doSomething();">Externally inserted attribute.</b>
			<a href="navigateThere();">Externally inserted tag</a>
			<span id="mwEz">Element with only id attribute is fine.</span>
			</p>`;
		const sanitizedExpandedDoc = `<p class="paragraph" id="mwEq">
			<b class="bold" id="mwEs">Externally inserted attribute.</b>
			<a>Externally inserted tag</a>
			<span id="mwEz">Element with only id attribute is fine.</span>
			</p>`;
		const extractedData = {
			1: { attributes: { id: 'mwEq', class: 'paragraph' } },
			2: { attributes: { id: 'mwEs', class: 'bold' } }
		};
		const parser = new Parser( new MwContextualizer() );
		parser.init();
		parser.write( corruptedDoc );
		const expandedDoc = parser.builder.doc.expand( extractedData );
		deepEqual(
			normalize( expandedDoc.getHtml() ),
			normalize( sanitizedExpandedDoc ),
			'Expanded the corrupted document by removing all externally inserted attributes.'
		);
	} );

	it( 'test if the content is block level template', () => {
		const testFiles = [
			'/data/test-block-template-section-1.html',
			'/data/test-block-template-section-2.html',
			'/data/test-block-template-section-3.html',
			'/data/test-block-template-section-4.html'
		];
		for ( let i = 0; i < testFiles.length; i++ ) {
			const contentForTest = readFileSync( dirname + testFiles[ i ], 'utf8' ).replace( /^\s+|\s+$/, '' );
			const parser = new Parser( new MwContextualizer() );
			parser.init();
			parser.write( contentForTest );
			assert.ok( isIgnorableBlock( parser.builder.doc ), `File ${ testFiles[ i ] } is section with block template` );
		}
	} );

	it( 'test HTML compaction roundtrip with inline style content', () => {
		const sourceDoc = `<section><p>
		<a href="Our title">ABC</a>
		<style> a { background: url(https://en.wikipedia.org/css-background); } </style>
		<script>original script</script>
		<script type="module" src="main.js"></script>
		<span id="mwKJ" typeof="mw:Entity">&ndash;</span>
		</p>
		</section>`;

		const expectedReducedDoc = `<section><p>
		<a id="1">ABC</a>
		<style id="2"></style>
		<script id="3"></script>
		<script id="4"></script>
		<span id="5">&ndash;</span>
		</p>
		</section>`;
		// MT result from external MT service. Assuming that it altered the style and script content.
		const corruptedMTInput = `<section><p>
		<a id="1" href="Their title">abc</a>
		<style id="2"> a { background: url(https://leaking.via/css-background); } </style>
		<script id="3">Corrupted script</script>
		<script id="4" src="https://bad.via/main.js"></script>
		<span id="5">©</span>
		</p>
		</section>`;
		// Expected final output after fixing all external modification
		const sanitizedExpandedDoc = `<section><p>
		<a href="Our title">abc</a>
		<style> a { background: url(https://en.wikipedia.org/css-background); } </style>
		<script>original script</script>
		<script type="module" src="main.js"></script>
		<span id="mwKJ" typeof="mw:Entity">&ndash;</span>
		</p>
		</section>`;
		let parser = new Parser( new MwContextualizer() );
		parser.init();
		parser.write( sourceDoc );
		const { reducedDoc, extractedData } = parser.builder.doc.reduce();
		deepEqual(
			normalize( reducedDoc.getHtml() ),
			normalize( expectedReducedDoc ),
			'Expanded the corrupted document by removing all externally inserted attributes.'
		);
		deepEqual( Object.keys( extractedData ).length, 5, 'Attributes for 2 tags extracted.' );
		deepEqual( !!extractedData[ '2' ].content, true, 'Content extracted for style tag' );
		deepEqual( !!extractedData[ '3' ].content, true, 'Content extracted for script tag' );
		deepEqual( !!extractedData[ '5' ].content, true, 'Content extracted for tag with mw:Entity' );
		parser = new Parser( new MwContextualizer() );
		parser.init();
		parser.write( corruptedMTInput );
		const expandedDoc = parser.builder.doc.expand( extractedData );
		deepEqual(
			normalize( expandedDoc.getHtml() ),
			normalize( sanitizedExpandedDoc ),
			'Expanded the corrupted document by ignoring modified style and script content'
		);
	} );

	it( 'test HTML compaction roundtrip with template with empty content', () => {
		const testXhtmlFile = dirname + '/data/text-inline-template-empty-content.html';
		const contentForReduce = readFileSync( testXhtmlFile, 'utf8' ).replace( /^\s+|\s+$/, '' );
		const parser = new Parser( new MwContextualizer() );
		parser.init();
		parser.write( contentForReduce );
		const { reducedDoc, extractedData } = parser.builder.doc.reduce();
		const reducedParser = new Parser( new MwContextualizer() );
		reducedParser.init();
		reducedParser.write( reducedDoc.getHtml() );
		deepEqual( Object.keys( extractedData ).length, 6, 'Attributes for 6 tags extracted.' );
		const expandedDoc = reducedParser.builder.doc.expand( extractedData );
		deepEqual(
			normalize( expandedDoc.getHtml() ),
			normalize( contentForReduce ),
			'Restored the original html after reduce and expand.'
		);
	} );

	it( 'test getRootItem for ignoring blockspaces', () => {
		const sourceDoc = `<section data-mw-section-id="25" id="mwArE">
		<p id="mwArI">Sestak voted for the <a rel="mw:WikiLink" href="./Improving_Head_Start_Act"
				title="Improving Head Start Act" id="mwArM" class="new">Improving Head Start Act</a> and the <a
				rel="mw:WikiLink" href="./College_Cost_Reduction_and_Access_Act"
				title="College Cost Reduction and Access Act" id="mwArQ"
				class="new">College Cost Reduction and Access Act</a>.
			</p>
		</section>`;

		const parser = new Parser( new MwContextualizer(), { isolateSegments: true } );
		parser.init();
		parser.write( sourceDoc );
		const rootItem = parser.builder.doc.getRootItem();
		deepEqual(
			rootItem.name,
			'p',
			'getRootItem should ignore the blockspaces in the beginning of the document'
		);
	} );

	it( 'test getRootItem for not ignoring non-whitespace content in textblock', () => {
		const sourceDoc = `<p id="mwFg">The tensor product of <span about="#mwt10" class="texhtml "
		data-mw="{}" id="mwFw" typeof="mw:Transclusion"><i>V</i></span> and.
		</p>`;

		const parser = new Parser( new MwContextualizer(), { isolateSegments: true } );
		parser.init();
		parser.write( sourceDoc );
		const parsedDoc = parser.builder.doc;
		const textblock = parsedDoc.items.find( ( item ) => item.type === 'textblock' );
		const rootItem = textblock.item.getRootItem();
		deepEqual(
			rootItem,
			null,
			'getRootItem of textblock should consider non-whitespace content inside its textchunks'
		);
	} );

	it( 'test getRootItem for ignoring whitespace content in textblock', () => {
		const sourceDoc = `<p id="mwFg">
		 <span about="#mwt10" class="texhtml "
		data-mw="{}" id="mwFw" typeof="mw:Transclusion"><i>V</i></span> and.
		</p>`;

		const parser = new Parser( new MwContextualizer(), { isolateSegments: true } );
		parser.init();
		parser.write( sourceDoc );
		const parsedDoc = parser.builder.doc;
		const textblock = parsedDoc.items.find( ( item ) => item.type === 'textblock' );
		const rootItem = textblock.item.getRootItem();
		deepEqual(
			rootItem.name,
			'span',
			'getRootItem of textblock should ignore whitespace content inside its textchunks'
		);
	} );
} );
