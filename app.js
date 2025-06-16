const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes');
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Mount all API routes under /api
app.use('/api', apiRouter);

// Error handling for Swagger UI
app.use((err, req, res, next) => {
  // Check if the error is a YAML parsing error
  if (err.message && err.message.includes('YAML')) {
    console.error('Swagger YAML Error:', err);
    return res.status(500).json({ 
      error: 'API Documentation Error', 
      details: 'Error parsing the API documentation file.'
    });
  }
  
  // Generic error handler
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
