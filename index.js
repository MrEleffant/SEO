/**
 * @file index.js
 * @description Main file of the project
 */

console.log(`\n
 .d8888b.  8888888888  .d88888b.  
d88P  Y88b 888        d88P" "Y88b 
Y88b.      888        888     888 
 "Y888b.   8888888    888     888 
    "Y88b. 888        888     888 
      "888 888        888     888 
Y88b  d88P 888        Y88b. .d88P 
 "Y8888P"  8888888888  "Y88888P"\n\n`)
console.log('Polytech SEO')

require('dotenv').config()
const puppeteer = require('puppeteer')
const inquirer = require('inquirer')
const fs = require('fs')
const cliProgress = require('cli-progress')

const motsCles = require('./data/mots.json')
let output = require('./data/output.json')
let page; let browser

(async () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prog',
      message: 'Select a programe',
      choices: ['Launch SEO', 'Get MOZ SEO', 'Generate data_set', 'Generate csv', 'Reset file']
    }
  ])
    .then((answers) => {
      switch (answers.prog) {
        case 'Launch SEO': {
          initSEO()
          break
        }
        case 'Get MOZ SEO': {
          getMOZSEO()
          break
        }
        case 'Generate data_set': {
          convertData()
          break
        }
        case 'Generate csv': {
          inquirer.prompt([
            {
              type: 'list',
              name: 'prog',
              message: 'Select a program',
              choices: ['exportDATA', 'Concatenate output initial file']
            }
          ])
            .then((answers) => {
              switch (answers.prog) {
                case 'exportDATA': {
                  exportDATA()
                  break
                }

                case 'Concatenate output initial file': {
                  concateData()
                  break
                }
              }
            })

          break
        }
        case 'Reset file': {
          // reset output.json and mots.json and output.csv
          inquirer.prompt([
            {
              type: 'list',
              name: 'prog',
              message: 'Select a file',
              choices: ['mots.json', 'output.json', 'pda.json', 'pa.json', 'csv Exports', 'data_set']
            }
          ])
            .then((answers) => {
              switch (answers.prog) {
                case 'mots.json': {
                  fs.writeFile('./data/mots.json', '[]', (err) => {
                    if (err) throw err
                    console.log('mots.json has been reset')
                  })
                  break
                }
                case 'output.json': {
                  fs.writeFile('./data/output.json', '{}', (err) => {
                    if (err) throw err
                    console.log('output.json has been reset')
                  })
                  break
                }
                case 'pda.json': {
                  fs.writeFile('./data/pda.json', '{}', (err) => {
                    if (err) throw err
                    console.log('pda.json has been reset')
                  })
                  break
                }
                case 'pa.json': {
                  fs.writeFile('./data/pa.json', '{}', (err) => {
                    if (err) throw err
                    console.log('pa.json has been reset')
                  })
                  break
                }
                case 'csv Exports': {
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'prog',
                      message: 'Select a file',
                      choices: ['export.csv', 'AnalyseOUTPUT.csv']
                    }
                  ])
                    .then((answers) => {
                      switch (answers.prog) {
                        case 'export.csv': {
                          fs.writeFile('./export/export.csv', 'CLE,DOMAIN,DA,URL,PA,MOTCLE,DIFMOTCLE', (err) => {
                            if (err) throw err
                            console.log('export.csv has been reset')
                          })
                          break
                        }

                        case 'AnalyseOUTPUT.csv': {
                          fs.writeFile('./export/AnalyseOutput.csv', 'Domaine;SEMrushRank;MoyenneClassementGooogle;Frequence;DA;MatchedDomain', (err) => {
                            if (err) throw err
                            console.log('export.csv has been reset')
                          })
                          break
                        }
                      }
                    })
                  break
                }
                case 'data_set': {
                  // acteurs ici les noms de domaines
                  fs.writeFile('./data_set/node.csv', 'ID;LABEL;MODULARITY', (err) => {
                    if (err) throw err
                    console.log('node.csv has been reset')
                  })
                  fs.writeFile('./data_set/edge.csv', 'SOURCE;TARGET;TYPE;ID;LABEL', (err) => {
                    if (err) throw err
                    console.log('edge.csv has been reset')
                  })
                  fs.writeFile('./data_set/edge2.csv', 'SOURCE;TARGET;TYPE;ID;LABEL', (err) => {
                    if (err) throw err
                    console.log('edge2.csv has been reset')
                  })
                  break
                }
                default: {
                  console.log('Error')
                }
              }
            })
          break
        }

        default: {
          process.exit()
        }
      }
    })
})()

async function initSEO () {
  console.log('Launching SEO')
  console.log(`Number of keyword : ${motsCles.length}`)
  console.log(`Estimated time : ${motsCles.length * 5} seconds`)

  browser = await puppeteer.launch({
    headless: false
  })
  page = await browser.newPage()

  for (const mot of motsCles) {
    await traitement(mot)
  }
  console.log("SEO's done")
  browser.close()
}

async function getMOZSEO () {
  const Moz = require('moz-api-wrapper')
  const pda = require('./data/pda.json')
  const pa = require('./data/pa.json')
  console.log('Getting MOZ SEO')

  const moz = new Moz({
    accessId: process.env.ACCESS_ID,
    secretKey: process.env.SECRET_KEY
  })

  console.log(`Getting the ${Object.keys(output).length} domains SEO`)
  await wait(5000)

  const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} | {filename} | {data} | {value}/{total}'
  }, cliProgress.Presets.shades_grey)

  const b1 = multibar.create(Object.keys(output).length, 0, { filename: 'Domain' })
  const b2 = multibar.create(100, 0, { filename: 'URL' })

  for (const url in output) {
    b1.increment({
      data: url
    })
    b2.update(0)
    let b2index = 0

    if (!pda[url]) {
      moz.urlMetrics
        .fetch(url, {
          cols: ['Title', 'Domain Authority']
        })
        .then((response) => {
          pda[url] = response.data.pda
          writeJsonFileUTF8('./data/pda.json', pda)
        })
        .catch((error) => {
          console.error(error)
        })
      await wait(3000)
    }

    for (const page of output[url]) {
      b2.update((++b2index * 100 / output[url].length), {
        data: page.liens
      })
      if (!pa[page.liens]) {
        moz.urlMetrics
          .fetch(page.liens, {
            cols: ['Page Authority']
          })
          .then((response) => {
            pa[page.liens] = response.data.upa
            writeJsonFileUTF8('./data/pa.json', pa)
          })
          .catch((error) => {
            console.error(error)
          })
        await wait(3000)
      }
    }
  }

  console.log('SEO\'s done')
}

async function traitement (mot) {
  await wait(5000) // attente de 5 secondes entre les requêtes
  output = require('./data/output.json')
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
  })
  console.log({ output })
  writeJsonFileUTF8('./data/output.json', output)
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
    })
}

function convertData () {
  console.log('Generating data_set')
  const nodes = {
    url: [],
    liens: [],
    motsCles: []
  }
  for (const url in output) {
    output[url].forEach((research) => {
      if (!nodes.url.includes(url)) {
        fs.appendFileSync('./data_set/node.csv', `\n${url};${url};1`) // acteurs
        nodes.url.push(url)
      }
      if (!nodes.motsCles.includes(research.motsCles)) {
        fs.appendFileSync('./data_set/node.csv', `\n${research.motsCles};${research.motsCles};2`)
        nodes.motsCles.push(research.motsCles)
      }

      fs.appendFileSync('./data_set/edge.csv', `\n${research.motsCles};${url};;;${research.motsCles}`) // nom de domaine vers lien
    })
  }
  console.log('data_set created')
}

function exportDATA () {
  const pda = require('./data/pda.json')
  const pa = require('./data/pa.json')
  console.log('Exporting DATA')

  for (const url in output) {
    output[url].forEach((research) => {
      let lien = research.liens

      lien = lien.toString()
      while (lien.includes(',')) {
        lien = lien.replace(',', '')
      }
      const CLE = url.replace(',', '').replace('https://', '').replace('http://', '')
      const data = `\n${CLE},${url.replace(',', '')},${pda[url]},${lien},${pa[research.liens] || ''},${research.motsCles.replace(',', '-')},Null`
      fs.appendFileSync('./export/export.csv', data) // nom de domaine vers lien
    })
  }
  console.log('Data exported')
}

function concateData () {
  const da = require('./data/pda.json')
  fs.readFile('./export/AnalyseInput.csv', 'utf8', (_err, data) => {
    data.split('\n').forEach(ligne => {
      if (ligne.includes('Domaine;SEMrushRank;MoyenneClassementGooogle;Frequence')) {
        return
      }

      const url = ligne.split(';')[0]

      // loop threw every da and find the one that match the most and save the da or null
      let daSave = null
      let domainSave = null
      for (const domaine in da) {
        if (domaine.includes(url)) {
          if (!da) {
            daSave = da[domaine]
            domainSave = domaine
          } else if (da[domaine] > daSave) {
            daSave = da[domaine]
            domainSave = domaine
          }
        }
      }

      const urlLine = `\n${ligne.replace('\r', '')};${daSave};${domainSave}`

      fs.appendFileSync('./export/AnalyseOutput.csv', urlLine) // nom de domaine vers lien
    })
  })
}
