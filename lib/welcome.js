import {
	DOMImplementation,
	XMLSerializer
} from 'xmldom';
import JsBarcode from 'jsbarcode';
import {
	JSDOM
} from 'jsdom';
import {
	readFileSync
} from 'fs';
import {
	join
} from 'path';
import {
	spawn
} from 'child_process';

var src = join(__dirname, '..', 'src')
var _svg = readFileSync(join(src, 'welcome.svg'), 'utf-8')
var barcode = data => {
	var xmlSerializer = new XMLSerializer();
	var document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
	var svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	JsBarcode(svgNode, data, {
		xmlDocument: document,
	});

	return xmlSerializer.serializeToString(svgNode);
}
var imageSetter = (img, value) => img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value)
var textSetter = (el, value) => el.textContent = value

var {
	document: svg
} = new JSDOM(_svg).window
/**
 * Generate SVG Welcome
 * @param {object} param0
 * @param {string} param0.wid
 * @param {string} param0.pp
 * @param {string} param0.name
 * @param {string} param0.text
 * @param {string} param0.background
 * @returns {string}
 */
var genSVG = async ({
	wid = '',
	pp = join(src, 'Welcome.jpg'),
	title = '',
	name = '',
	text = '',
	background = ''
} = {}) => {
	var el = {
		code: ['#_1661899539392 > g:nth-child(6) > image', imageSetter, toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png')],
		pp: ['#_1661899539392 > g:nth-child(3) > image', imageSetter, pp],
		text: ['#_1661899539392 > text.fil1.fnt0', textSetter, text],
		title: ['#_1661899539392 > text.fil2.fnt1', textSetter, title],
		name: ['#_1661899539392 > text.fil2.fnt2', textSetter, name],
		bg: ['#_1661899539392 > g:nth-child(2) > image', imageSetter, background],
	}
	for (var [selector, set, value] of Object.values(el)) {
		set(svg.querySelector(selector), value)
	}
	return svg.body.innerHTML
}

var toImg = (svg, format = 'png') => new Promise((resolve, reject) => {
	if (!svg) return resolve(Buffer.alloc(0))
	var bufs = []
	var im = spawn('magick', ['convert', 'svg:-', format + ':-'])
	im.on('error', e => reject(e))
	im.stdout.on('data', chunk => bufs.push(chunk))
	im.stdin.write(Buffer.from(svg))
	im.stdin.end()
	im.on('close', code => {
		if (code !== 0) reject(code)
		resolve(Buffer.concat(bufs))
	})
})

var toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`

/**
 * Render SVG Welcome
 * @param {object} param0
 * @param {string} param0.wid
 * @param {string} param0.pp
 * @param {string} param0.name
 * @param {string} param0.text
 * @param {string} param0.background
 * @returns {Promise<Buffer>}
 */
var render = async ({
	wid = '',
	pp = toBase64(readFileSync(join(src, 'avatar_contact.png')), 'image/png'),
	name = '',
	title = '',
	text = '',
	background = toBase64(readFileSync(join(src, 'Aesthetic', 'Aesthetic_000.jpeg')), 'image/jpeg'),
} = {}, format = 'png') => {
	var svg = await genSVG({
		wid,
		pp,
		name,
		text,
		background,
		title
	})
	return await toImg(svg, format)
}

if (require.main === module) {
	render({
		wid: '1234567890',
		// pp: '',
		name: 'John Doe',
		text: 'Lorem ipsum\ndot sit color',
		title: 'grup testing'
		// background: ''
	}, 'jpg').then(result => {
		// console.log(result)
		process.stdout.write(result)
	})
	// toImg(barcode('test')).then(result => {
	//     // console.log(result)
	//     process.stdout.write(result)

	// })
} else module.exports = render
