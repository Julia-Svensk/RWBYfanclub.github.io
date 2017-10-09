  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyATGBdD6p4FDgeYOSrHE8PnIwqnji8Fuqc",
    authDomain: "rwbyfanclub-25fac.firebaseapp.com",
    databaseURL: "https://rwbyfanclub-25fac.firebaseio.com",
    projectId: "rwbyfanclub-25fac",
    storageBucket: "rwbyfanclub-25fac.appspot.com",
    messagingSenderId: "760840282933"
  };
  firebase.initializeApp(config);

var app = angular.module("app", ["firebase"]);
// Vi skapar en kommentarer-fabrik som hämtar blogg-inlägg från firebase
app.factory("kommentarer", function($firebaseArray) {
    // skapa en referens till var i databasen kommentarerna finns
    var ref = firebase.database().ref().child("kommentarer");
    return $firebaseArray(ref);
  }
);

// Här i "controllern" så kan vi bestämma vad som ska hända med vår HTML
app.controller("KommentarCtrl", function($scope, kommentarer) {
    // Vi gör så att vi kan komma åt inläggen i kommentarer-fabriken med ng-model
    $scope.kommentarer = kommentarer;

    $scope.kommentar = {
        text: "",
        skribent: ""
    };
    // Vi skapar en funktion som vi kan köra i ng-submit för att skicka kommentaren till databasen
    $scope.addComment = function() {
        // Här lägger vi till vårt inlägg ($scope.kommentar) till listan med inlägg.
        // Det sparas automatiskt i Firebase-databasen.
        $scope.kommentarer.$add($scope.kommentar);

        // Tömmer texten i textfälten
        $scope.kommentar = {
            text: "",
            skribent: ""
        };
    };
  }
);

// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

// and use it in our controller
app.controller("UserCtrl", ["$scope", "Auth",
    function($scope, Auth) {
        $scope.auth = Auth;
        $scope.signInUser = function() {
            $scope.message = null;
            $scope.error = null;

            // Create a new user
            Auth.$signInWithEmailAndPassword($scope.email, $scope.password)
                .then(function(firebaseUser) {
                    $scope.message = "User signed in with uid: " + firebaseUser.uid;
                }).catch(function(error) {
                    $scope.error = error;
                });
        };

        $scope.createUser = function() {
          $scope.message = null;
          $scope.error = null;

          // Create a new user
          Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
            .then(function(firebaseUser) {
              $scope.message = "User created with uid: " + firebaseUser.uid;
            }).catch(function(error) {
              $scope.error = error;
            });
        };


        $scope.auth.$onAuthStateChanged(function(firebaseUser) {
            $scope.firebaseUser = firebaseUser;
            console.log(firebaseUser);
        });
    }
]);
