# This is our CS 546 Web Programming I Final Project: MyGarage
Our application works with the motive of managing car maintenance, allowing users to find service centers based on service offered and ratings. Regular users are able to use our application to find the service centers that fit their needs, while service center owners are able to advertise and manage the services that they offer.

## How to Setup
Run 'npm install' to install the required dependencies for our project.  
Then run 'npm run seed' to run the task of seeding the database.

## How the Application Works
- Upon running 'npm start' website with load on 'http://localhost:3000/', the first page will be the landing page.
- A non-authenticated user will be able to view the list of garages, and the individual page of a garage which contains appointment history and inventory.
- Only a logged in, or authenicated, user will be able to mark as favorite, schedule an appoitnment, see the appointment expense. 
- In addition, an authenticated user will be able to view their own profile which includes information about their account, favorite garage, description and vehicles they have.
