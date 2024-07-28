# Vulcan Anticheat Analysis

The Vulcan Anticheat Analysis is a React-based web application designed to visualize and analyze anticheat data from Minecraft servers using the Vulcan Anticheat plugin. This tool provides insights into player behavior, violation patterns, and overall server security.

## Web App

Click [Here](https://vulcan-anticheat-analysis.vercel.app/ "Here") To View This Dashboard Online!

![screencapture-vulcan-anticheat-analysis-vercel-app-2024-07-28-14_47_11 (1)](https://github.com/user-attachments/assets/6a2f8676-fd25-4461-a62f-907db6af06a3)

## Features

-   File upload for `punishments.txt` and `violations.txt`
-   Interactive data visualization for punishments and violations
-   Detailed analysis of anticheat data
-   Player search functionality
-   Date range selection for filtered analysis
-   Responsive design for various screen sizes

## Usage

Users can interact with the Vulcan Anticheat Analysis dashboard in the following ways:

### Data Upload and Analysis

-   **Upload Files**: Upload punishments.txt and violations.txt files from your Vulcan Anticheat logs.
-   **View Analytics**: See detailed visualizations of punishment and violation data.
-   **Search Players**: Use the player search feature to find specific player's anticheat history.
-   **Date Range Selection**: Filter data based on specific date ranges.

### Data Visualization

-   **Punishment Analysis**: View total punishments, punishments by type, and top punished players.
-   **Violation Analysis**: Examine total violations, violations by type, and top violating players.
-   **Trend Analysis**: Analyze violation trends over time.

## Requirements

-   Node.js 14.0 or higher
-   npm 6.0 or higher

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Kaludii/vulcan-anticheat-analysis.git
   ```

2. Navigate to the project directory:
   ```
   cd vulcan-anticheat-analysis
   ```

3. Install the required packages:
   ```
   npm install
   ```

4. Run the app in development mode:
   ```
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

5. To create a production build:
   ```
   npm run build
