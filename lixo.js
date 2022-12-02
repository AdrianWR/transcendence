const proces = require('process')

process.argv.forEach((val, index) => { 
	console.log(`${index}: ${val}`)
})

console.log(process.argv)
console.log(process.argv[1])
console.log(process.argv[2])

const oranges = ['orange', 'orange', 'banana', 'banana', 'banana']
const apples = ['just one apple']
oranges.forEach((fruit) => {
	console.count(fruit)
})
apples.forEach((fruit) => {
	console.count(fruit)
})
