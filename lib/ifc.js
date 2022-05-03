import request from 'request'
import * as cheerio from 'cheerio'

export const horarioEM = async() => {
  return new Promise((resolve, reject) => {
    request(`http://sombrio.ifc.edu.br`, (err, req, body) => {
      const $ = cheerio.load(body);
      let status = $("#collapse-10 > li:nth-child(1) > a").attr('href');
      if(status){
        resolve(status)
      } else {
        reject("error")
      }
    })
  })
}