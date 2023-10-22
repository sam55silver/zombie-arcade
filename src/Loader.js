import { Assets, Text, Container } from 'pixi.js';
import fonts from './fonts.json';
import get_leader_board from './LeaderBoard/getLeaderBoard';

const Loader = (app) => {
  return new Promise(async (resolve, reject) => {
    // Create a loading screen
    const loadingScreen = new Container();
    loadingScreen.x = app.renderer.width / 2;
    loadingScreen.y = app.renderer.height / 2;
    app.stage.addChild(loadingScreen);

    const loadingScreenStyle = {
      ...fonts.headerStyle,
      fontSize: 12 * app.spriteScale,
    }

    const loadingText = new Text('Loading...', loadingScreenStyle);
    loadingText.anchor.set(0.5);
    loadingScreen.addChild(loadingText);

    // Load assets
    Assets.load('../assets/textureAtlas.json')
      .then((sheet) => {
        get_leader_board()
          .then((scores) => {
            resolve({sheet, scores});
          })
          .catch((err) => {
            console.error(err)
            resolve({sheet, scores: []})
          })
          .finally(() => {
            app.stage.removeChild(loadingScreen);
          })
      })
      .catch((err) => {
        // Update loading text
        loadingScreen.removeChild(loadingText);

        const errorText = new Text('Error Loading\nAssets', {...loadingScreenStyle, fill: 0xff0000});
        errorText.anchor.set(0.5);
        loadingScreen.addChild(errorText);

        // Reject promise to stop execution
        reject(err);
      });
  });
};

export default Loader;
