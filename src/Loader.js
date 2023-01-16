import { Assets, Text, Container } from 'pixijs';

const Loader = (app) => {
  return new Promise(async (resolve, reject) => {
    // Create a loading screen
    const loadingScreen = new Container();
    loadingScreen.x = app.renderer.width / 2;
    loadingScreen.y = app.renderer.height / 2;
    app.stage.addChild(loadingScreen);

    const loadingScreenStyle = {
      fontFamily: 'Arial',
      fontSize: 40,
      fill: 0x1fc24a,
      align: 'center',
      fontStyle: 'bold',
    };

    const loadingText = new Text('Loading...', loadingScreenStyle);
    loadingText.anchor.set(0.5);
    loadingScreen.addChild(loadingText);

    // Load assets
    Assets.load('../Assets/textureAtlas.json')
      .then((sheet) => {
        // Update loading text
        app.stage.removeChild(loadingScreen);

        resolve(sheet);
      })
      .catch((err) => {
        // Update loading text
        loadingScreen.removeChild(loadingText);

        const errorText = new Text('Error loading assets!', loadingScreenStyle);
        loadingScreen.addChild(errorText);

        // Reject promise to stop execution
        reject(err);
      });
  });
};

export default Loader;
