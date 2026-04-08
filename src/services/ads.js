import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-9592355687689566/5549961335';

let interstitialAd = null;
let articleCount = 0;

const createInterstitialAd = () => {
  interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Interstitial ad loaded');
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    createInterstitialAd(); // preload next ad
  });

  interstitialAd.load();
};

export const initInterstitialAds = () => {
  createInterstitialAd();
};

export const showInterstitialAd = () => {
  articleCount++;
  // Show interstitial every 4 articles
  if (articleCount % 4 === 0 && interstitialAd && interstitialAd.loaded) {
    interstitialAd.show();
  }
};
