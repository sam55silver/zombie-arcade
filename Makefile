.PHONY: build clean

build:
	echo "Building..."
	npm i
	npm run build
	mv ./dist ./docker/frontend/dist
	mkdir -p ./docker/api/build
	cp server.py ./docker/api/build/server.py
	cp requirements.txt ./docker/api/build/requirements.txt

clean:
	echo "Cleaning..."
	rm -rf ./docker/frontend/dist
	rm -rf ./docker/api/build

