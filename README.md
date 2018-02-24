# Database-Project for SER322 Spring 2018A

This is a Python Flask web server connecting to a MySQL 5.6 instance hosted in AWS.

## Dependencies

The following is required to successfully run this project:
* Python 3.6 or greater
* pipenv Python module
    * [PipEnv](https://github.com/pypa/pipenv)
    
## Config

A **config.py** file is needed to store all configurations for **server.py**.  An example is provided under the **config** directory.  

## Running

To run the project, first a pipenv should be activated in the root directory.  Then an environment variable FLASK_APP needs to be assigned to **server.py**.  To help automate this process, a script can be created.

### Mac

**init.sh** has been created to script this process.  Running this from the command line should begin the server.  If not, you can also start the server by:
* From root project folder type 'EXPORT FLASK_APP=./Group16/server.py'
* If this is the first time running the server, you may need to type 'pipenv install' to install all dependencies
* Then type 'pipenv run flask run'

### Windows

After installing Python3 and Pipenv perform the following to start the server:
* From root project folder type 'SET FLASK_APP=./Group16/server.py'
* If this is the first time running the server, you may need to type 'pipenv install' to install all dependencies
* Then type 'pipenv run flask run'