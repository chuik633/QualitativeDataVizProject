// require("dotenv").config();
// const fs = require("fs");
// const csv = require("csv-parser");
// const { OpenAI } = require("openai");

// // Initialize OpenAI API
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Delay function
// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // Function to analyze the text and get a decorative score
// async function getDecorativeScore(row) {
//   // Extract fields from the row, handling missing values
//   const notesText = row["notes"] || "";
//   const titleText = row["title"] || "";
//   const physicalDescription = row["physicalDescription"] || "";
//   const objectType = row["objectType"] || "";
//   const topic = row["topic"] || "";

//   const messages = [
//     {
//       role: "system",
//       content: "You are an expert fashion analyst.",
//     },
//     {
//       role: "user",
//       content: `Analyze the following hat information and assign a numerical score between 0 and 1 indicating how decorative (ornamental, artistic, aesthetically pleasing) or functional (used in business or work, utilitarian) the hat is. A score of 1.00 means the hat is purely decorative, 0.00 means it is purely functional, and scores in between mean they serve both to some degree. Provide only the numerical score as a decimal between 0.00 and 1.00.

// Title: "${titleText}"
// Physical Description: "${physicalDescription}"
// Object Type: "${objectType}"
// Topic: "${topic}"
// Notes: "${notesText}"

// Score:`,
//     },
//   ];

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: messages,
//       max_tokens: 5,
//       temperature: 0,
//     });

//     const scoreText = response.choices[0].message.content.trim();
//     const score = parseFloat(scoreText);

//     // Validate and ensure the score is between 0 and 1
//     if (!isNaN(score) && score >= 0 && score <= 1) {
//       return score;
//     } else {
//       console.warn(
//         `Invalid score "${scoreText}" for description: ${notesText}`
//       );
//       return "";
//     }
//   } catch (error) {
//     console.error("Error calling OpenAI API:", error);
//     return "";
//   }
// }

// // Read the CSV file and process each row
// async function processCsv() {
//   const results = [];
//   const readStream = fs.createReadStream("df_hats.csv").pipe(csv());
//   for await (const row of readStream) {
//     // Process each row
//     const score = await getDecorativeScore(row);

//     // Create a new object with only the desired columns
//     const outputRow = {
//       title: row["title"] || "",
//       physicalDescription: row["physicalDescription"] || "",
//       objectType: row["objectType"] || "",
//       topic: row["topic"] || "",
//       notes: row["notes"] || "",
//       decorative_score: score,
//     };

//     results.push(outputRow);

//     // Add a delay to pace the requests
//     await delay(100); // Delay of 100 milliseconds
//   }

//   // Write the results to a new CSV file
//   const createCsvWriter = require("csv-writer").createObjectCsvWriter;

//   // Get the header from the first row's keys
//   const headers = Object.keys(results[0]).map((key) => ({
//     id: key,
//     title: key,
//   }));

//   const csvWriter = createCsvWriter({
//     path: "df_hats_with_scores.csv",
//     header: headers,
//   });

//   await csvWriter.writeRecords(results);
//   console.log("Output CSV file with scores written successfully");
// }

// // Execute the script
// processCsv();
// // const fs = require("fs");
// const csv = require("csv-parser");
// const natural = require("natural");

// // Use the Logistic Regression Classifier
// const classifier = new natural.LogisticRegressionClassifier();

// // Instantiate the tokenizer
// const tokenizer = new natural.WordTokenizer();

// // Function to add training documents
// function addTrainingDocument(text, label) {
//   const tokens = tokenizer.tokenize(text);
//   classifier.addDocument(tokens, label);
// }

// // Training Data
// addTrainingDocument(
//   "A red, canvas, pledge bucket hat with an off-white band around the base of the crown from Delta Sigma Theta sorority. Adhered to the front of the crown is a white patch with a red design and border. At the top of the crown is an off-white, top button. The patch features eight (8) pyramids of varying size above the word [PYRAMID]. One of the pyramids is large and placed at the top center of the patch. The interior of the hat is red and has a white sweatband with a handwritten inscription in red ink that reads: [PYRAMID [---?] Cheryl].",
//   "decorative"
// );

// addTrainingDocument(
//   "A knitted mohair beret hat in a cream color. The interior of the hat is unlined. There is a cream colored Petersham ribbon that is stitched along the interior brim. There is no label.",
//   "decorative"
// );

// addTrainingDocument(
//   "A pillbox hat adorned with pink and white flowers. The top of the crown is flat and tapers straight downwards at the sides. The base of the hat is made of pink buckram. The exterior of the hat is covered in velvet and synthetic silk flowers attached to the buckram with adhesive. The flowers are colored with pink and white ombre petals. Pistons made of tightly wrapped paper with a coating are adhered to the center of each flower. There is one green fabric leaf at the center of the top of the crown. The interior of the hat is unlined. The bottom edge has a metal wire and is covered in machine stitched pink velvet.",
//   "decorative"
// );

// addTrainingDocument(
//   "A beige brushed wool felt hat. The hat is made of one piece of blocked wool felt. The crown of the hat fits closely to the head. The hat is brimless, the edges of the hat are tucked into the interior. Metal wire is whip stitched to the raw edge at the hat's interior. A rayon petersham ribbon is machine stitched to the edge of the hat at the interior. There is a printed label on the interior at the top of the crown that reads [MERRIMAC Merri-Soie], smaller text surrounding this is illegible.",
//   "decorative"
// );

// addTrainingDocument(
//   "Beginning in the late 18th century, some volunteer fire fighters began to wear hats painted with their company’s name to identify themselves at chaotic fire scenes. During the 19th century, these fire hats became more ornate, as portraits of historical figures, patriotic scenes, allegorical images, or company icons were painted alongside the company’s name, motto, or founding date. Made of pressed felt, these “stove-pipe” hats were primarily used in Philadelphia, but other nearby cities such as Baltimore and Washington adopted them as well. Fire hats were personal items with the owner’s initials often painted on the top of the hat. While these hats were worn at fires, they are more colloquially known as “parade hats.” Fire companies commonly marched in the many parades of the period and these ornate hats contributed to the visual culture of their day. These distinguishing features in a company’s regalia often proclaimed the members’ cultural and political identity as well as their position on contested topics such as work, religion and immigration.",
//   "functional"
// );

// addTrainingDocument(
//   "The traditional American leather firefighter’s helmet with its distinctive long rear brim, frontpiece, and crest adornment was first developed around 1821-1836 in New York City. Henry T. Gratacap, a New York City luggage maker by trade, is often credited as the developer of this style of fire helmet. Gratacap created a specially treated leather helmet with a segmented “comb” design that led to unparalleled durability and strength. The elongated rear brim (also known as a duckbill or beavertail) and frontpiece were 19th century innovations that remain the most identifiable feature of firefighter’s helmets. The body of the helmet was primarily designed to deflect falling debris, the rear brim prevented water from running down firefighters’ backs, and their sturdy crowns could aid, if necessary, in breaking windows.",
//   "functional"
// );

// addTrainingDocument(
//   'A U.S. Model 1858 Forage Cap. The crown of the cap is made from dark blue wool broadcloth with two (2) vent holes on each side. The top of the crown has two crossed brass canons with the number “4” in front of them. It has a cotton liner with a maker’s label attached to the crown that reads "M. & G. / No. 6 / N.Y." It has an interior hat band of brown leather. The bill is made from paperboard covered in black leather on the top and bottom sides. A black leather chin strap is attached above the bill from left to right, with one (1) gilt brass US military eagle insignia button at each end of the strap. A gilt brass buckle is attached to the middle of the strap.',
//   "functional"
// );

// addTrainingDocument(
//   "A taupe-colored bonnet with cross-stitched brim and chin straps believed to have been worn by Martha Miller Barnes while she was enslaved as a field laborer by E.A.J. Miller on his plantation near Waterproof, Louisiana.",
//   "functional"
// );

// // Train the classifier
// classifier.train();

// // Read the CSV file
// const results = [];
// fs.createReadStream("df_hats.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     const notesText = row["notes"];
//     // Check if notesText exists
//     if (notesText) {
//       // Tokenize the notesText
//       const tokens = tokenizer.tokenize(notesText);
//       // Classify the tokens
//       const classifications = classifier.getClassifications(tokens);

//       // Find the probability of 'decorative' and 'functional'
//       let decorativeProb = 0;
//       let functionalProb = 0;
//       for (const item of classifications) {
//         if (item.label === "decorative") {
//           decorativeProb = item.value;
//         } else if (item.label === "functional") {
//           functionalProb = item.value;
//         }
//       }

//       // Normalize probabilities
//       const totalProb = decorativeProb + functionalProb;
//       if (totalProb > 0) {
//         decorativeProb = decorativeProb / totalProb;
//         functionalProb = functionalProb / totalProb;
//       }

//       // Assign a score (e.g., use the probability of 'decorative')
//       const score = decorativeProb;

//       // Add the score to the row
//       row["decorative_score"] = score;

//       // Push the row to results
//       results.push(row);
//     } else {
//       // If notesText is missing, push the row without classification
//       row["decorative_score"] = "";
//       results.push(row);
//     }
//   })
//   .on("end", () => {
//     console.log("CSV file successfully processed");

//     // Now, write the results to a new CSV file
//     const createCsvWriter = require("csv-writer").createObjectCsvWriter;

//     // Get the header from the first row's keys
//     const headers = Object.keys(results[0]).map((key) => ({
//       id: key,
//       title: key,
//     }));

//     const csvWriter = createCsvWriter({
//       path: "df_hats_with_scores.csv",
//       header: headers,
//     });

//     csvWriter.writeRecords(results).then(() => {
//       console.log("Output CSV file with scores written successfully");
//     });
//   });
