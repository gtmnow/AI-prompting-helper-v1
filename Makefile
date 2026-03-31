# Install dependencies
install:
	npm install

# Run dev server
run:
	npm run dev

# Build for production
build:
	npm run build

# Preview production build
preview:
	npm run preview

# Clean node modules (optional)
clean:
	rm -rf node_modules dist

deploy:
	npm run build
	npm run deploy
	
