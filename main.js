var coinApp = angular.module('coinApp', ['tw-currency-select', 'ngMaterialDatePicker']);
coinApp.controller('mainController', function ($scope, $http) {
  $scope.dateTimeStart = "2018-01-10";
  $scope.dateTimeEnd = "2018-01-18";

  var startDate = moment($scope.dateTimeStart).format('YYYY-MM-DD');
  var endDate = moment($scope.dateTimeEnd).format('YYYY-MM-DD');
  console.log(endDate);

  $scope.title = "Bitcoin Exchange";
  $scope.currencyChangeCount = 0;
  $scope.currencyCodeChangeCount = 0;

  $scope.total_usd_amount = 0.0;
  $scope.total_currency_amount = 0.0;
  $scope.total_usd_units = 0.0;
  $scope.total_currency_units = 0.0;

  $scope.currency_to_convert_to = { code: 'NGN', name: 'Nigerian Naira' };

  $scope.currenciesWithNames = [
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'CAD', name: 'Canadian Dollars' },
    { code: 'JPY', name: 'Japanese yen' },
    { code: 'CHF', name: 'Swiss franc' },
    { code: 'RUB', name: 'Russian rouble' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'SGD', name: 'Singapore dollar' }

  ];

  checkSession = function () {
    var registerToken = window.sessionStorage.getItem("login_token");
    if (!registerToken) {
      window.location.href = "login.html";
    }
  }

  $scope.logout = function () {
    window.sessionStorage.removeItem("login_token");
    alert(" You have Logged Out Succesfully")
    window.location.href = "login.html";
  }
  $scope.getPrice = function () {
    checkSession();
    console.log("Trying to get price");
    $http({
      method: 'GET',
      url: 'https://api.coindesk.com/v1/bpi/currentprice/' + $scope.currency_to_convert_to.code + '.json'
    }).then(function successCallback(response) {
      $scope.rates = [];
      var bpi = response.data.bpi;
      var disclaimer = response.data.disclaimer;
      $scope.disclaimer = disclaimer;
      $scope.rates.push(bpi['USD']);
      $scope.rates.push(bpi[$scope.currency_to_convert_to.code]);

      $scope.calculateTotal();
      $scope.calculateUnits();
    }, function errorCallback(response) {
      console.error(response);
    });
  }

  $scope.getData = function () {

    $http({
      method: 'GET',
      url: "https://api.coindesk.com/v1/bpi/historical/close.json?start=" + startDate + "&end=" + endDate
    }).then(function successCallback(response) {

      $scope.history = response.data.bpi;

    }, function errorCallback(response) {
      console.error(response);
    });
  }
  $scope.calculateTotal = function () {
    console.log($scope.rates);

    angular.forEach($scope.rates, function (bt_rate) {
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

  $scope.calculateUnits = function () {
    angular.forEach($scope.rates, function (bt_rate) {
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
    //console.log("submitted: ", $scope.email, $scope.passwd);
    if (typeof $scope.email == "undefined" || typeof $scope.passwd == "undefined") {
      alert("Ensure you enter correct email and password");
      return;
    }

    $http({
      method: 'POST',
      url: 'http://localhost:5000/api/login',
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
      alert("Login failed: " + response.data.message);
    });
  };
});


coinApp.controller('RegisterController', function ($scope, $http) {


  $scope.init = function () {
    var registerToken = window.sessionStorage.getItem("register_token");
    if (!!registerToken) {
      window.location.href = "login.html";
    }
  }

  $scope.handleFormRegister = function () {

    if (typeof $scope.email == "undefined" || typeof $scope.passwd == "undefined") {
      alert("Ensure you enter correct email and password");
      return;
    }

    console.log("we are here")
    console.log("submitted: ", 
      $scope.first_name,
      $scope.last_name,
      $scope.email,
      $scope.currency,
      $scope.password,
      $scope.confirmpassword);
    $http({
      method: 'POST',
      url: 'http://localhost:5000/api/register',
      data: {
        "first_name": $scope.first_name,
        "last_name": $scope.last_name,
        "email": $scope.email,
        "currency": $scope.currency,
        "password": $scope.password,
        "confirmpasswd": $scope.confirmpassword
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
      alert("Login failed: " + response.data.error);
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





