##App Seed:##

Download the chrome-extension-seed.

Load the root of the chrome-extension-seed (as a testing extension).

Load the `app` directory as the actual application that you will be developing.

####Using grunt watcher for testing.
Later in the terminal run:
* `npm install` - will install all the node modules

* `grunt w` - will set file watchers and start up the socket server.
 

After running the grunt w command in the terminal, turn on (or refresh) the test application in the browser - it will open a socket to the socket server.


####Alreay have an application...?
Download this source of this project and paste your application code inside the `app` directory

Now you are good to go! every time a .js file is saved, the test app will run all the tests.
