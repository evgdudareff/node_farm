//////////
//SERVER

let http = require('http');
let url = require('url');
const fs = require('fs');
const slugify = require('slugify');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
//console.log(slugs);

let replaceTemplate = (temp, data) => {
  let outData = temp.replace(/{%PRODUCT_NAME%}/g, data.productName);
  outData = outData.replace(/{%ID%}/g, data.id);
  outData = outData.replace(/{%IMAGE%}/g, data.image);
  outData = outData.replace(/{%FROM%}/g, data.from);
  outData = outData.replace(/{%NUTRIENTS%}/g, data.nutrients);
  outData = outData.replace(/{%QUANTITY%}/g, data.quantity);
  outData = outData.replace(/{%PRICE%}/g, data.price);
  outData = outData.replace(/{%DESCRIPTION%}/g, data.description);

  if (!data.organic) {
    outData = outData.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return outData;
};

let server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    let cardsHTML = dataObj
      .map(dataItem => replaceTemplate(tempCard, dataItem))
      .join('');
    let outputHTML = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
    res.end(outputHTML);

    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    let outputHTML = replaceTemplate(tempProduct, dataObj[query.id]);
    res.end(outputHTML);

    //API page
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);
  }

  //not found page
  else {
    res.writeHead(404, {
      'content-type': 'text/html'
    });
    res.end('<h1>Page is not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is listening on port 8000');
});

//////////
//FILES
//const fs = require('fs');
//Blocking mode, synchronous way
/* let textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
let textOut = `this is what we know about avocado___: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
 */

//Non-Blocking mode, asynchronous way
/* fs.readFile('./txt/start.txt','utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`,'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`,'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
                if (err) {throw new Error('Fuck...')}
                console.log('Your file has been written :)');
            })
        });
    });
});

console.log('Will read file!'); */
