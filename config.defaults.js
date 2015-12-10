'use strict';

module.exports = {
	// CX Server port
	port: 8080,
	proxy: null,
	logging: {
		name: 'cxserver',
		// log streams. Comment out unwanted streams or add new.
		streams: [
			/* {
				// Use gelf-stream -> logstash.
				type: 'gelf',
				host: 'localhost', // host where logstash with gelf input plugin is running
				port: 12201, // port of host where logstash with gelf input plugin is running
				level: 'info' // log INFO and above to gelf
			},*/
			{
				level: 'debug',
				stream: process.stdout // log DEBUG and above to stdout. Useful for development.
			}
		]
	},
	// Accept requests from the given domains. * for all domains.
	allowCORS: '*',
	// Parsoid API URL
	'parsoid.api': 'http://parsoid-lb.eqiad.wikimedia.org/@lang.wikipedia.org/v3/page/html/@title',
	// RESTBase API URL
	'restbase.url': 'https://@lang.wikipedia.org/api/rest_v1/page/html/@title',
	// Apertium web API URL
	'mt.apertium.api': 'http://apertium.wmflabs.org',
	'mt.yandex.api': 'https://translate.yandex.net',
	'mt.yandex.key': null,
	jwt: {
		secret: '',
		algorithms: [ 'HS256' ]
	},
	// Use SSL?
	secure: false,
	// SSL key filename
	sslkey: null,
	// SSL cert filename
	cert: null,
	// Service registry
	registry: {
		source: [ 'ab', 'ace', 'af', 'ak', 'am', 'ang', 'an', 'arc', 'ar', 'arz', 'ast', 'as', 'av', 'ay', 'az', 'bar', 'ba', 'bcl', 'be-tarask', 'be', 'bg', 'bho', 'bi', 'bjn', 'bm', 'bn', 'bo', 'bpy', 'br', 'bs', 'bug', 'bxr', 'ca', 'cbk-zam', 'cdo', 'ceb', 'ce', 'chr', 'ch', 'chy', 'ckb', 'co', 'crh-latn', 'cr', 'csb', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'diq', 'dsb', 'dv', 'dz', 'ee', 'el', 'eml', 'en', 'eo', 'es', 'et', 'eu', 'ext', 'fa', 'ff', 'fi', 'fj', 'fo', 'frp', 'frr', 'fr', 'fur', 'fy', 'gag', 'gan', 'ga', 'gd', 'glk', 'gl', 'gn', 'gom', 'got', 'gsw', 'gu', 'gv', 'hak', 'ha', 'haw', 'he', 'hif', 'hi', 'hr', 'hsb', 'ht', 'hu', 'hy', 'ia', 'id', 'ie', 'ig', 'ik', 'ilo', 'io', 'is', 'it', 'iu', 'ja', 'jbo', 'jv', 'kaa', 'kab', 'ka', 'kbd', 'kg', 'ki', 'kk', 'kl', 'km', 'kn', 'koi', 'ko', 'krc', 'ksh', 'ks', 'ku', 'kv', 'kw', 'ky', 'lad', 'la', 'lbe', 'lb', 'lez', 'lg', 'lij', 'li', 'lmo', 'ln', 'lo', 'lrc', 'ltg', 'lt', 'lv', 'lzh', 'mai', 'map-bms', 'mdf', 'mg', 'mhr', 'min', 'mi', 'mk', 'ml', 'mn', 'mrj', 'mr', 'ms', 'mt', 'mwl', 'myv', 'my', 'mzn', 'nah', 'nan', 'nap', 'na', 'nds-nl', 'nds', 'ne', 'new', 'nl', 'nn', 'nov', 'no', 'nrm', 'nso', 'nv', 'ny', 'oc', 'om', 'or', 'os', 'pag', 'pam', 'pap', 'pa', 'pcd', 'pdc', 'pfl', 'pih', 'pi', 'pl', 'pms', 'pnb', 'pnt', 'ps', 'pt', 'qu', 'rm', 'rmy', 'rn', 'roa-tara', 'rup', 'ro', 'rue', 'ru', 'rw', 'sah', 'sa', 'scn', 'sco', 'sc', 'sd', 'se', 'sg', 'sgs', 'sh', 'simple', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'srn', 'sr', 'ss', 'stq', 'st', 'su', 'sv', 'sw', 'szl', 'ta', 'tet', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tpi', 'tr', 'ts', 'tt', 'tum', 'tw', 'tyv', 'ty', 'udm', 'ug', 'uk', 'ur', 'uz', 'vec', 'vep', 've', 'vi', 'vls', 'vo', 'vro', 'war', 'wa', 'wo', 'wuu', 'xal', 'xh', 'xmf', 'yi', 'yo', 'yue', 'za', 'zea', 'zh', 'zu' ],
		target: [ 'ab', 'ace', 'af', 'ak', 'am', 'ang', 'an', 'arc', 'ar', 'arz', 'ast', 'as', 'av', 'ay', 'az', 'bar', 'ba', 'bcl', 'be-tarask', 'be', 'bg', 'bho', 'bi', 'bjn', 'bm', 'bn', 'bo', 'bpy', 'br', 'bs', 'bug', 'bxr', 'ca', 'cbk-zam', 'cdo', 'ceb', 'ce', 'chr', 'ch', 'chy', 'ckb', 'co', 'crh-latn', 'cr', 'csb', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'diq', 'dsb', 'dv', 'dz', 'ee', 'el', 'eml', 'en', 'eo', 'es', 'et', 'eu', 'ext', 'fa', 'ff', 'fi', 'fj', 'fo', 'frp', 'frr', 'fr', 'fur', 'fy', 'gag', 'gan', 'ga', 'gd', 'glk', 'gl', 'gn', 'gom', 'got', 'gsw', 'gu', 'gv', 'hak', 'ha', 'haw', 'he', 'hif', 'hi', 'hr', 'hsb', 'ht', 'hu', 'hy', 'ia', 'id', 'ie', 'ig', 'ik', 'ilo', 'io', 'is', 'it', 'iu', 'ja', 'jbo', 'jv', 'kaa', 'kab', 'ka', 'kbd', 'kg', 'ki', 'kk', 'kl', 'km', 'kn', 'koi', 'ko', 'krc', 'ksh', 'ks', 'ku', 'kv', 'kw', 'ky', 'lad', 'la', 'lbe', 'lb', 'lez', 'lg', 'lij', 'li', 'lmo', 'ln', 'lo', 'lrc', 'ltg', 'lt', 'lv', 'lzh', 'mai', 'map-bms', 'mdf', 'mg', 'mhr', 'min', 'mi', 'mk', 'ml', 'mn', 'mrj', 'mr', 'ms', 'mt', 'mwl', 'myv', 'my', 'mzn', 'nah', 'nan', 'nap', 'na', 'nds-nl', 'nds', 'ne', 'new', 'nl', 'nn', 'nov', 'no', 'nrm', 'nso', 'nv', 'ny', 'oc', 'om', 'or', 'os', 'pag', 'pam', 'pap', 'pa', 'pcd', 'pdc', 'pfl', 'pih', 'pi', 'pl', 'pms', 'pnb', 'pnt', 'ps', 'pt', 'qu', 'rm', 'rmy', 'rn', 'roa-tara', 'rup', 'ro', 'rue', 'ru', 'rw', 'sah', 'sa', 'scn', 'sco', 'sc', 'sd', 'se', 'sg', 'sgs', 'sh', 'simple', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'srn', 'sr', 'ss', 'stq', 'st', 'su', 'sv', 'sw', 'szl', 'ta', 'tet', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tpi', 'tr', 'ts', 'tt', 'tum', 'tw', 'tyv', 'ty', 'udm', 'ug', 'uk', 'ur', 'uz', 'vec', 'vep', 've', 'vi', 'vls', 'vo', 'vro', 'war', 'wa', 'wo', 'wuu', 'xal', 'xh', 'xmf', 'yi', 'yo', 'yue', 'za', 'zea', 'zh', 'zu' ],
		mt: {
			Apertium: {
				af: [ 'nl' ],
				an: [ 'es' ],
				ar: [ 'mt' ],
				ast: [ 'es' ],
				bg: [ 'mk' ],
				br: [ 'fr' ],
				ca: [ 'en', 'es', 'eo', 'fr', 'oc', 'pt', 'simple' ],
				cy: [ 'en', 'simple' ],
				en: [ 'ca', 'eo', 'es', 'gl', 'sh' ],
				eo: [ 'en', 'simple' ],
				es: [ 'an', 'ast', 'ca', 'en', 'eo', 'fr', 'gl', 'it', 'oc', 'pt', 'simple' ],
				eu: [ 'en', 'es', 'simple' ],
				fr: [ 'ca', 'eo', 'es' ],
				gl: [ 'en', 'es', 'simple' ],
				hi: [ 'ur' ],
				id: [ 'ms' ],
				is: [ 'en', 'sv' ],
				it: [ 'ca', 'es' ],
				kk: [ 'tt' ],
				mk: [ 'bg', 'sr' ],
				ms: [ 'id' ],
				mt: [ 'ar' ],
				nl: [ 'af' ],
				nn: [ 'da', 'nb', 'no' ],
				no: [ 'nn' ],
				oc: [ 'ca', 'es' ],
				pt: [ 'ca', 'es', 'gl' ],
				ro: [ 'es' ],
				sh: [ 'en', 'simple', 'sl' ],
				simple: [ 'ca', 'eo', 'es', 'gl', 'sh' ],
				sl: [ 'sh', 'sr' ],
				sv: [ 'da', 'is' ],
				tt: [ 'kk' ],
				ur: [ 'hi' ]
			},
			Yandex: {
				en: [ 'ru' ],
				'be-tarask': [ 'ru' ],
				be: [ 'ru' ],
				uk: [ 'ru' ]
			}
		},
		dictionary: {
			JsonDict: {
				ca: [ 'es' ],
				en: [ 'es' ],
				es: [ 'ca' ]
			}
		}
	}
};
