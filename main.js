//gets currency from user selection
var coinApp = angular.module('coinApp', ['tw-currency-select']);
coinApp.controller('mainController', function($scope, $http) {

    $scope.title = "My Bitcoin Exchange";
    $scope.currencyChangeCount = 0;
    $scope.currencyCodeChangeCount = 0;

    $scope.total_usd_amount = 0.0;
    $scope.total_currency_amount = 0.0;
    $scope.total_usd_units = 0.0;
    $scope.total_currency_units = 0.0;
   
    $scope.currency_to_convert_to =  {code: 'NGN',  name: 'Nigerian Naira'};

    $scope.currenciesWithNames = [
      {code: 'EUR',  name: 'Euro'},
      {code: 'GBP', name: 'British Pound'},
      {code: 'NGN',  name: 'Nigerian Naira'},
      {code: 'CNY',  name: 'Chinese Yuan'},
      {code: 'CAD',  name: 'Canadian Dollars'}
  ];

  checkSession = function () {
    var registerToken = window.sessionStorage.getItem("register_token");
    if (!registerToken) {
      window.location.href = "register.html";
    }
  }
  
    $scope.getPrice = function() {
      checkSession();
      console.log("Trying to get price");   
      $http({
        method: 'GET',
        url: 'https://api.coindesk.com/v1/bpi/currentprice/' + $scope.currency_to_convert_to.code + '.json'
      }).then(function successCallback(response) {
        $scope.rates = [];
          var bpi = response.data.bpi;
          var disclaimer = response.data.disclaimer;
          $scope.disclaimer=disclaimer;
          $scope.rates.push(bpi['USD']);
          $scope.rates.push(bpi[$scope.currency_to_convert_to.code]);

          $scope.calculateTotal();
          $scope.calculateUnits();
        }, function errorCallback(response) {
          console.error(response);
        });
    }
      $scope.calculateTotal = function() {
        console.log($scope.rates);
        
      angular.forEach($scope.rates, function(bt_rate) {
       var total = bt_rate.rate_float * $scope.units;
        
        if (bt_rate.code == "USD") {
          $scope.total_currency_amount = 0.00;
          $scope.total_usd_amount = total;      
        } else {
            $scope.total_currency_amount = total;
            $scope.total_usd_amount = 0.00; 
        }
      });
    };
   
    $scope.calculateUnits = function() {
      angular.forEach($scope.rates, function(bt_rate) {
        if (bt_rate.code == $scope.currency_to_convert_to.code) {
          var units = parseInt($scope.amount) / bt_rate.rate_float;
          if (bt_rate.code == "USD") {
            $scope.total_usd_units = units;
            $scope.total_currency_units = 0.00;
          } else {
           $scope.total_currency_units = units;
            $scope.total_usd_units = 0.00;
          }
        }
      });
    };
  });

coinApp.controller('LoginController', function ($scope, $http) {
  $scope.init = function () {
    var loginToken = window.sessionStorage.getItem("login_token");
    if (!!loginToken) {
      window.location.href = "index.html";
    }
  }

  $scope.handleFormSubmit = function () {
       console.log("submitted: ", $scope.email, $scope.passwd);
    $http({
      method: 'POST',
      url: 'https://reqres.in/api/login',
      data: {
        "email": $scope.email,
        "password": $scope.passwd
      }
    }).then(function successCallback(response) {
      if (!!response.data.token) {
        window.sessionStorage.setItem("login_token", response.data.token);
        alert("Login successful");
        window.location.href = "index.html";
      } else {
        alert("Login failed unknown error");
      }
    }, function errorCallback(response) {
      alert("Login failed: "+response.data.error);
    });
  };
});


coinApp.controller('RegisterController', function ($scope, $http) {
  console.log("what")

  $scope.init = function () {
    var registerToken = window.sessionStorage.getItem("register_token");
    if (!!registerToken) {
      window.location.href = "login.html";
    }
  }

  $scope.handleFormRegister = function () {
    console.log("we are here")
    console.log("submitted: ", $scope.username, $scope.passwd, $scope.username,
 $scope.name,
    $scope.email,
   $scope.currency,
     $scope.passwd,
    $scope.confirmpasswd);
    $http({
      method: 'POST',
      url: 'https://reqres.in/api/register',
      data: {
        "username": $scope.username,
        "name": $scope.name,
        "email": $scope.email,
        "currency": $scope.currency,
        "password": $scope.passwd,
        "confirmpasswd": $scope.confirmpasswd
      }
    }).then(function successCallback(response) {
      if (!!response.data.token) {
        window.sessionStorage.setItem("register_token", response.data.token);
        alert("Registration successful");
        window.location.href = "login.html";
      } else {
        alert("Login failed unknown error");
      }
    }, function errorCallback(response) {
      alert("Login failed: "+response.data.error);
    });
  };

  $scope.currenciesWithNames = [
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'CAD', name: 'Canadian Dollars' }
  ];
});





