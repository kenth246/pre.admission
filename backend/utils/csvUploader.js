const fs = require('fs');
const csv = require('csv-parser');
const Question = require('../models/question');
const connectDB = require('../config/db');

// Reads a CSV file, formats the rows into Question objects, and saves them into the MongoDB database
const uploadCSV = async(filePath) => {
    await connectDB();
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            const choicesArray = data.choices ? data.choices.split('|') : [];
            results.push({
                category: "BCeT",
                question_text: data.question,
                options: {
                    A: choicesArray[0] || "",
                    B: choicesArray[1] || "",
                    C: choicesArray[2] || "",
                    D: choicesArray[3] || ""
                },
                correct_answer: data.answer
            });
        })

    .on('end', async() => {
        try {
            // Insert Questions into MongoDB
            await Question.insertMany(results);
            console.log(`${results.length} questions uploaded successfully!`);
            process.exit(0);
        } catch (err) {
            console.error("Error inserting questions:", err.message);
            process.exit(1);
        }
    });
};