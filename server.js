import { config } from 'dotenv';
import app from './src/app';
import log from './src/config/debug';

config();
const port = process.env.PORT || 5000;
app.listen(port, log.app(`Server running on port ${port}`));
