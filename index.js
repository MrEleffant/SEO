console.log('Polytech SEO')
const puppeteer = require('puppeteer')
const fs = require('fs')
const motsCles = require('./data/mots.json')
const output = require('./data/output.json')
let page; let browser

prog()

async function prog () {
  browser = await puppeteer.launch({
    headless: false
  })
  page = await browser.newPage()

  for (const mot of motsCles) {
    console.log(mot)
    await page.goto(`https://www.google.fr/search?q=${mot}`, { waitUntil: 'networkidle2' })
    const searchResults = await page.$$eval('.LC20lb', (els) =>
      els.map((e) => ({ title: e.innerText, link: e.parentNode.href }))
    )
    searchResults.forEach((research) => {
      // research.domain = getDomain(research.link)
      const domain = getDomain(research.link)
      if (!output[domain]) {
        output[domain] = {
          motsClesDetectes: [],
          liensExacts: []
        }
      }
      if (!output[domain].motsClesDetectes.includes(mot)) output[domain].motsClesDetectes.push(mot)
      output[domain].liensExacts.push(research.link)
      writeJsonFileUTF8('./data/output.json', output)
    })
    console.log(searchResults)
  }
}

function getDomain (url) {
  const arr = url.split('/')
  return arr[0] + '//' + arr[2]
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
