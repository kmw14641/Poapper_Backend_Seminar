const fs = require('fs');

const book = {
    "name": "Linear Algebra and its Applications",
    "version": "4th edition",
    "writer": "Gilbert Strang",
    "publisher": "Brooks/Cole",
    "year": 2006,
    "ISBN": "0-534-42200-4"
}

fs.writeFileSync("textbook.json", JSON.stringify(book, null, 2));