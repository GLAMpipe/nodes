### Docker Compose (needs more testing)

GLAMpipe can be installed via [Docker compose](https://docs.docker.com/compose/). So first you need to install Docker:
https://docs.docker.com/engine/installation/


1. Clone GLAMpipe repository:

        git clone https://github.com/artturimatias/GLAMpipe.git
        cd GLAMpipe



2. Then install GLAMpipe. There is a dockerhub image that you can use:

        docker-compose pull
        
    Or, if you want to build from source:
 
        docker-compose build
        
    And finally:
        
        docker-compose up


This takes a while at first time but next time the start up is almost instant. Finally you should see something like this:

    
        ********************* G L A M p i pe *************************
        * DATA PATH: /home/arihayri/GLAMpipe_DATA
        * NODE PATH: 
        * STATUS:    running on http://0.0.0.0:3000
        ********************* G L A M p i pe *************************
        


 Just type http://localhost:3000 in your browser and you should have GLAMpipe in front of you. 
 You can stop GLAMpipe by pressing CTRL + C
 
 #### Possible problems with docker compose install

When you run "docker-compose up" command first time, the mongo service might start later that GLAMpipe. This means that GLAMpipe refuses to start. Just press CTRL + C and then type again "docker-compose up".

If there is still a problem with database, you can try to start mongo first:

	docker-compose up -d mongo

And then:

	docker-compose up glam
