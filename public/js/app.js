var app = angular.module('starter', []);
app.controller('HomeCtrl', ['$http', '$scope', function($http, $scope) {
  $http.get("/books")
  .then(function(response) {
  	  $scope.books = response;
	  $scope.tblData = getData();
	  	
	  $scope.remove = function(rowId){
	    var target = '#row' + rowId;
	    $(target).replaceWith(getTemplate(rowId));
	    console.log("rowId", rowId);

	  }
	  
	  function getData() {
	    return ['Author','Title','Location'];
	  }
	  
	  function getTemplate(){
	    var t = '';
	    t += '<tr class="alert alert-success alert-dismissible">';
	    t += '<td colspan="6">';
	    t += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
	    t += '<strong>Done!</strong> Removed from Library Fired</td></tr>';
	    
	    return t
	  }
	});

  	$scope.deleteEntry = function(id){
		// Id is passed in from DOM. The route is root + parameter.
		$http.delete("/" + id)
		.then(function(response){
		});
  	}

  	$scope.updateEntry = function(id, updatedEntry){
  		console.log("id", id);
  		console.log("updatedEntry", updatedEntry);
		$http.put("/" + id, updatedEntry)	
		.success(function(){
			console.log("success");
		})
		.error(function(){
			console.log("Error");
		});
		// .then(
	 //       function(response){
	 //         console.log("success response from update app.js", response);
	 //       }, 
	 //       function(response){
	 //         console.log("FAIL", response);
	 //       }
	 //    );
	};
}]);	

app.directive( 'editInPlace', function() {
  return {
    restrict: 'E',
    scope: { value: '=' },
    template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      element.addClass( 'edit-in-place' );
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;
        
        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );
        
        // And we must focus the element. 
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };
      
      // When we leave the input, we're done editing.
      inputElement.prop( 'onblur', function() {
        $scope.editing = false;
        element.removeClass( 'active' );
      });
    }
  };
});
