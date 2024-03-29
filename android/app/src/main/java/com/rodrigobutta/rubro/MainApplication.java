package com.rodrigobutta.rubro;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.lottie.LottiePackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.cmcewen.blurview.BlurViewPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // <-- Add this line

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

// import com.pusher.pushnotifications.BeamsTokenProvider; // este era para el pusher nativo
// import com.pusher.pushnotifications.AuthDataGetter; 
// import com.pusher.pushnotifications.PushNotifications; 
// import com.pusher.pushnotifications.AuthData; 

import com.b8ne.RNPusherPushNotifications.RNPusherPushNotificationsPackage;  // ahora uso libreria con metodos events y eso


public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new LottiePackage(),
                new RNUUIDGeneratorPackage(),
                new PickerPackage(),
                new BlurViewPackage(),
                new RNGoogleSigninPackage(),
                new VectorIconsPackage(),
                new FBSDKPackage(mCallbackManager),
                new RNFirebasePackage(),
                new RNGestureHandlerPackage(),
                new RNFirebaseAuthPackage() ,
                new RNPusherPushNotificationsPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        FacebookSdk.setApplicationId("2342131725810594");
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);

        // este era para el pusher nativo
        // PushNotifications.start(getApplicationContext(), "063823b2-17a8-4234-8ba8-92cd22f58b40");
        // PushNotifications.addDeviceInterest("hello");

        // BeamsTokenProvider tokenProvider = new BeamsTokenProvider(
        //     "http://local.rubro.com.ar/api/test/notification-negotiate-token",
        //     new AuthDataGetter() {
        //         @Override
        //         public AuthData getAuthData() {
        //             // Headers and URL query params your auth endpoint needs to
        //             // request a Beams Token for a given user
        //             HashMap<String, String> headers = new HashMap<>();
        //             // for example:
        //             // headers.put("Authorization", sessionToken);
        //             HashMap<String, String> queryParams = new HashMap<>();
        //             return new AuthData(
        //                     headers,
        //                     queryParams
        //             );
        //         }
        //     }
        // );

        // PushNotifications.setUserId("1", tokenProvider, new BeamsCallback<Void, PusherCallbackError>(){
        //     @Override
        //     public void onSuccess(Void... values) {
        //         Log.i("PusherBeams", "Successfully authenticated with Pusher Beams");
        //     }
    
        //     @Override
        //     public void onFailure(PusherCallbackError error) {
        //         Log.i("PusherBeams", "Pusher Beams authentication failed: " + error.getMessage());
        //     }
        // });

        

    }



    

    


}
