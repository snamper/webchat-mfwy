/**
 * Created by Administrator on 2015/9/15 0015.
 */
angular.module("connection-edit", ["resource.connections"]).config([
    "$routeProvider", function ($routeProvider) {
        return $routeProvider.when("/connections/new/:id", {
            templateUrl: "/app/connection/edit/connection-edit.tpl.html",
            controller: 'ConnectionEditCtrl',
            resolve: {
                connection: ["$q", "$route", "Pictures", function ($q, $route, Pictures) {
                    var deferred;
                    deferred = $q.defer();
                    Pictures.get({
                        id: $route.current.params.id
                    }, function (data) {
                        var ac = {
                            name: "",//名称
                            company: "",//地址
                            address: "",//时间  数组  开始时间和结束时间
                            qq: "",//另外的信息  主题、主办方、简介
                            phone: "",//图片  广告、海报
                            whcaht: "",
                            images: data.images
                        };
                        return deferred.resolve(ac);
                    });
                    return deferred.promise;

                }]
            }
        }).when("/connection/:id", {
            templateUrl: "/app/connection/edit/connection-edit.tpl.html",
            controller: 'ConnectionEditCtrl',
            resolve: {
                connection: [
                    "$q", "$route", "Connections", function ($q, $route, Connections) {
                        var deferred;
                        deferred = $q.defer();
                        Connections.get({
                            id: $route.current.params.id
                        }, function (data) {
                            return deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                ]
            }
        })
    }
])
    .controller("ConnectionEditCtrl", ["$scope", "$routeParams", "$location", "$rootScope", "$http", "FileUploader", "Connections", "connection", "Pictures", "messager",
        'ngDialog','ipCookie', function ($scope, $routeParams, $location, $rootScope, $http, FileUploader, Connections, connection, Pictures, messager, ngDialog,ipCookie) {


            $scope.get = function () {

                $scope.entity = connection;

                // console.log($scope.entity.images.ad);
            };

            $scope.submit = function () {
                console.log($location.path().substr(0, 15));
                console.log($routeParams.id);
                $scope.isSubmit = true;
                $scope.loading = "Saving";
                return save();
            };

            save = function () {
                var entity;
                $scope.loading = "Saving";
                entity = $scope.entity;
                /* entity.images = {"ad": [$scope.entity.adUrl, ad], "poster": [$scope.entity.posterUrl, poster]};
                 entity.time = [$scope.entity.startTime, $scope.entity.endTime];

                 delete $scope.entity.startTime;
                 delete $scope.entity.endTime;
                 delete  $scope.entity.adUrl;
                 delete  $scope.entity.posterUrl;
                 entity.statistics = [0, 0, 0];*/
                if ($location.path().substr(0, 16) == '/connections/new') {

                    Pictures.get({
                        id: $routeParams.id
                    }, function (data) {
                        /*angular.forEach(data.images,function(items){
                         console.log(items);
                         entity.images.push(items);
                         });*/
                        entity.images = data.images;
                        entity.currentAdd=ipCookie('currentAdd');
                        return Connections.post(entity, function (data) {





                            messager.success("Save successfully.");
                            return $location.path("/family");
                        });


                    });
                } else {
                    return Connections.put({
                        id: "" + entity.id
                    }, entity, function (data) {


                        messager.success("modify successfully.");
                        return $location.path("/family");
                        //return $location.path("/activity");
                        /*var promise = $http({
                         method:"post",
                         url:""+config.url.api+"/qrcode",
                         data:{"id":data.id}
                         });

                         promise.then(function(resp){
                         messager.success("modify successfully.");
                         return $location.path("/activity");
                         }, function(resp){})*/
                    });
                }
            };
            $scope.modify = function () {

                $scope.isSubmit = true;
                $scope.loading = "Modifing";
                save();
            };
            saveModify = function () {
                /*  var entity;
                 $scope.loading = "Saving";
                 entity = $scope.entity;
                 return Activities.put({
                 id: "" + entity.id
                 }, entity, function (data) {
                 return messager.success("Save successfully.");
                 });*/
            };

            //上传设计文件 dialog
            $scope.uploadFile = function () {
                $scope.id = $routeParams.id;
                ngDialog.open({
                    template: '/app/connection/upload/upload-edit.tpl.html',
                    controller: 'UploadDialogCtrl',
                    scope: $scope
                });
            };


            return $scope.get();


        }]);