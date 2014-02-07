##App Seed:##

###NOTE: Do not clone this app!###

Start by downloading the app-seed.

once downloaded in U Browser, load unpackaged app: 

Load the root of the seed app (as a testing app).

Load the app directory as the actual application that you will be developing.

####Using grunt watcher for testing.
Later in the terminal run:
* `npm install` - will install all the node modules

* `grunt w` - will set file watchers and start up the socket server.
 

After running the grunt w command in the terminal, turn on the test application in the U Browser - it will open a socket to the socket server.


####Alreay have an application...?
Download this source of this project and paste your application code inside the `app` directory
######NOTE: make sure you did not copy and paste the .git directory onto the app directory - this should be in the root.
You might want to realod the project in the Prepros (if you are using it).
You definetly want to load the application in the browser from the `app` directory instead of the root directory.
The root directory now will contain the tests for the app.


Now you are good to go! every time a .js file is saved, the test app will run all the tests.
