const readline = required('readline')

const changedString = stuffToMatchAgainst = "Jon Johny John"
let changedString = stuffToMatchAgainst.replace("John")
console.log(changedString)
let john = {
    name: "Samantha",
    type: "turtle",
    age: "eternal",
    eat: food => {
        console.log("I am No")
    }
}

let world = "everything"

john.eat = world => {
    world.destroy()
}
console.log(john)