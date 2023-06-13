import { Assets, Text, Container, Loader, Spritesheet  } from 'pixi.js';
// import textureAtlas from './textureAtlas.json';
// import Texture from './textureAtlas.png';

const AssetLoader = (app) => {
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

    const sheet = await Assets.load(['textureAtlas.json']);
    console.log(sheet);
  

    // const texture = new Image();
    // texture.src = '/textureAtlas.png';

    // console.log(textureAtlas);

    // const sheet = new Spritesheet(texture, textureAtlas);
    // await sheet.parse();
    // console.log(sheet)
    
    // console.log(TextureAtlas)
    // resolve(TextureAtlas);

    // Load assets
    // Assets.load({TextureAtlas})
    //   .then((sheet) => {
    //     // Update loading text
    //     app.stage.removeChild(loadingScreen);

    //     resolve(sheet);
    //   })
    //   .catch((err) => {
    //     // Update loading text
    //     loadingScreen.removeChild(loadingText);

    //     const errorText = new Text('Error Loading Assets', loadingScreenStyle);
    //     errorText.anchor.set(0.5);
    //     loadingScreen.addChild(errorText);

    //     // Reject promise to stop execution
    //     reject(err);
    //   });
  });
};

export default AssetLoader;
