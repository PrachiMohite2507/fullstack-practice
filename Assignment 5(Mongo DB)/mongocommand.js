// Select database
db = db.getSiblingDB("college");

// Create collection and insert data
db.students.insertMany([
    { name: "Prachi", age: 19, branch: "IT" },
    { name: "Rahul", age: 20, branch: "CSE" },
    { name: "Sneha", age: 19, branch: "IT" }
]);

// READ - display all students
print("All Students:");
printjson(db.students.find().toArray());

// READ - find IT students
print("IT Students:");
printjson(db.students.find({ branch: "IT" }).toArray());

// UPDATE - update Prachi's age
db.students.updateOne(
    { name: "Prachi" },
    { $set: { age: 20 } }
);

// DELETE - delete Rahul
db.students.deleteOne({ name: "Rahul" });

// Display final data
print("Final Data:");
printjson(db.students.find().toArray());