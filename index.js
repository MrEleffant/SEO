console.log('Polytech SEO')
const puppeteer = require('puppeteer')
const fs = require('fs')
const motsCles = require('./data/mots.json')
const output = require('./data/output.json')
let page; let browser

(async () => {
  browser = await puppeteer.launch({
    headless: false
  })
  page = await browser.newPage()

  for (const mot of motsCles) {
    await traitement(mot)
  }
})()

async function traitement (mot) {
  await wait(5000) // attente de 5 secondes entre les requêtes
  console.log(mot)
  await page.goto(`https://www.google.fr/search?q=${mot}`, { waitUntil: 'networkidle2' })
  const searchResults = await page.$$eval('.LC20lb', (els) =>
    els.map((e) => ({ title: e.innerText, link: e.parentNode.href }))
  )
  searchResults.forEach((research) => {
    const domain = getDomain(research.link)
    if (!output[domain]) {
      output[domain] = []
    }
    output[domain].push(
      {
        motsCles: mot,
        liens: research.link
      })
    writeJsonFileUTF8('./data/output.json', output)
  })
  console.log(searchResults)
}

function getDomain (url) {
  const arr = url.split('/')
  return arr[0] + '//' + arr[2]
}

async function wait (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function writeJsonFileUTF8 (path, variable) {
  fs.writeFile(path,
    JSON.stringify(variable, null, 1), 'utf8',
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}
