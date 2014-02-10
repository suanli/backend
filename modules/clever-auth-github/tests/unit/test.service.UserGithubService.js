var expect = require ( 'chai' ).expect
  , request = require ( 'supertest' )
  , path = require( 'path' )
  , app = require ( path.resolve( __dirname + '/../../../../' ) + '/index.js' )
  , config = require( 'config' )
  , testEnv = require ( 'utils' ).testEnv()
  , sinon = require( 'sinon' )
  , Q = require ( 'q' );

var UserService = null;

var gUserId_1, accessedAtDate, gUser, user_1;

describe( 'service.UserGithubService', function () {
    var Service, Model;

    before( function ( done ) {
        this.timeout( 15000 );
        testEnv( function ( _UserGithubService_, _ORMUserGithubModel_ ) {

            Service = _UserGithubService_;
            Model = _ORMUserGithubModel_;

            done();
        }, done );
    } );

    describe( '.formatData( profile, accessToken )', function () {

        it( 'should return an object with filtered data', function ( done ) {
            var accessToken = 'sdasdasdasdasdasdasdasda'
              , profile = {
                    _json: { login: 'denshikov-vovan',
                        id: 45454545,
                        avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x',
                        gravatar_id: 'e98ef168c69fd2a812a8dd46a775072a',
                        url: 'https://api.github.com/users/denshikov-vovan',
                        html_url: 'https://github.com/denshikov-vovan',
                        followers_url: 'https://api.github.com/users/denshikov-vovan/followers',
                        following_url: 'https://api.github.com/users/denshikov-vovan/following{/other_user}',
                        gists_url: 'https://api.github.com/users/denshikov-vovan/gists{/gist_id}',
                        starred_url: 'https://api.github.com/users/denshikov-vovan/starred{/owner}{/repo}',
                        subscriptions_url: 'https://api.github.com/users/denshikov-vovan/subscriptions',
                        organizations_url: 'https://api.github.com/users/denshikov-vovan/orgs',
                        repos_url: 'https://api.github.com/users/denshikov-vovan/repos',
                        events_url: 'https://api.github.com/users/denshikov-vovan/events{/privacy}',
                        received_events_url: 'https://api.github.com/users/denshikov-vovan/received_events',
                        type: 'User',
                        site_admin: false,
                        name: 'Volodymyr',
                        company: 'Clevertech',
                        blog: '',
                        location: 'Ukraine',
                        email: 'volodymyrm@clevertech.biz',
                        hireable: false,
                        bio: null,
                        public_repos: 0,
                        public_gists: 0,
                        followers: 1,
                        following: 0,
                        created_at: '2013-08-27T09:35:10Z',
                        updated_at: '2014-02-07T16:18:12Z',
                        private_gists: 0,
                        total_private_repos: 0,
                        owned_private_repos: 0,
                        disk_usage: 0,
                        collaborators: 0,
                        plan:
                        { name: 'free',
                            space: 307200,
                            collaborators: 0,
                            private_repos: 0 } }
                };

            var data = Service.formatData( profile, accessToken );

            expect( data ).to.be.an( 'object' ).and.be.ok;

            expect( data ).to.have.property( 'email' ).and.equal( profile._json.email );
            expect( data ).to.have.property( 'firstname' ).and.equal( 'Volodymyr' );
            expect( data ).to.have.property( 'lastname' ).and.be.null;
            expect( data ).to.have.property( 'githubid' ).and.equal( profile._json.id );
            expect( data ).to.have.property( 'picture' ).and.equal( profile._json.avatar_url );
            expect( data ).to.have.property( 'link' ).and.equal( profile._json.html_url );
            expect( data ).to.have.property( 'locale' ).and.equal( profile._json.location );
            expect( data ).to.have.property( 'token' ).and.equal( accessToken );
            
            expect( data ).to.not.have.property( 'bio' );
            expect( data ).to.not.have.property( 'name' );
            expect( data ).to.not.have.property( 'plan' );

            done();
        } );

    } );

    describe( '.findOrCreate( profile, accessToken )', function () {

        it( 'should not call ORMUserGithubModel.find() if email is not define', function ( done ) {
            var accessToken = 'sdasdasdasdasdasdasdasda'
                , profile = {
                    _json: {
                        id: '112064034597570891032',
                        email: null,
                        name: 'Volodymyr',
                        html_url: 'https://github.com/denshikov-vovan',
                        location: 'Ukraine',
                        avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                    }
                };

            var spy = sinon.spy( Model, 'find' );

            Service
                .findOrCreate( profile, accessToken )
                .then( function ( result ) {

                    expect( result ).to.not.be.ok;

                    expect( spy.called ).to.be.false;

                    spy.restore();

                    done();
                }, done )
        } );

        it( 'should call ORMUserGithubModel.find(), ORMUserGithubModel.create() and create gUser if github account do not already exist', function ( done ) {
            var accessToken = 'sdasdasdasdasdasdasdasda'
              , profile = {
                    _json: {
                        id: '112064034597570891032',
                        email: 'volodymyrm@clevertech.biz',
                        name: 'Volodymyr',
                        html_url: 'https://github.com/denshikov-vovan',
                        location: 'Ukraine',
                        avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                    }
                };

            var spyFind = sinon.spy( Model, 'find' );
            var spyCreate = sinon.spy( Model, 'create' );

            Service
                .findOrCreate( profile, accessToken )
                .delay( 1000 )
                .then( function ( result ) {

                    expect( result ).to.be.an( 'object' ).and.be.ok;
                    expect( result ).to.have.property( 'id' ).and.be.ok;

                    expect( spyFind.called ).to.be.true;
                    expect( spyFind.calledOnce ).to.be.true;

                    expect( spyCreate.called ).to.be.true;
                    expect( spyCreate.calledOnce ).to.be.true;

                    spyFind.restore();
                    spyCreate.restore();

                    Model
                        .find( result.id )
                        .success( function( user ) {

                            expect( user ).to.be.an( 'object' ).and.be.ok;
                            expect( user ).to.have.property( 'id' ).and.equal( result.id );
                            expect( user ).to.have.property( 'token' ).and.equal( accessToken );
                            expect( user ).to.have.property( 'firstname' ).and.equal( profile._json.name );
                            expect( user ).to.have.property( 'lastname' ).and.be.null;
                            expect( user ).to.have.property( 'email' ).and.equal( profile._json.email );
                            expect( user ).to.have.property( 'githubid' ).and.equal( profile._json.id );
                            expect( user ).to.have.property( 'accessedAt' ).and.be.ok;

                            gUserId_1 = user.id;
                            accessedAtDate = +new Date( user.accessedAt );
                            gUser = user;

                            done();
                        })
                        .error( done );
                }, done )
        } );

        it( 'should call ORMUserGithubModel.find(), ORMUserGithubModel.updateAttributes(), not call ORMUserGithubModel.create() and update already existing gUser', function ( done ) {
            var accessToken = '15151515151515151'
              , profile = {
                    _json: {
                        id: '112064034597570891032',
                        email: 'volodymyrm@clevertech.biz',
                        name: 'Volodymyr',
                        html_url: 'https://github.com/denshikov-vovan',
                        location: 'Ukraine',
                        avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                    }
                };

            var spyFind = sinon.spy( Model, 'find' );
            var spyCreate = sinon.spy( Model, 'create' );

            Service
                .findOrCreate( profile, accessToken )
                .then( function ( result ) {

                    expect( result ).to.be.an( 'object' ).and.be.ok;
                    expect( result ).to.have.property( 'id' ).and.equal( gUserId_1 );
                    expect( result ).to.have.property( 'token' ).and.equal( accessToken );

                    var newAccessedAtDate = +new Date( result.accessedAt );

                    expect( accessedAtDate ).to.not.equal( newAccessedAtDate );

                    expect( spyFind.called ).to.be.true;
                    expect( spyFind.calledOnce ).to.be.true;

                    expect( spyCreate.called ).to.be.false;

                    spyFind.restore();
                    spyCreate.restore();

                    done();
                }, done )
        } );

    } );

    describe( '.authenticate( gUser, profile )', function () {

        before( function( done ) {
            var accessToken = '516516516+51+651'
              , profile = {
                    _json: {
                        id: '151151515151515',
                        email: 'volodymyr1m@clevertech.biz',
                        name: 'Volodymyr Denshchykov',
                        html_url: 'https://github.com/denshikov-vovan',
                        location: 'Ukraine',
                        avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                    }
                };

            try {
                UserService = injector.getInstance( 'UserService' );
            } catch ( err ) {
                console.log( err );
            }

            Service
                .findOrCreate( profile, accessToken )
                .then( function( user ) {

                    expect( user ).to.be.an( 'object' ).and.be.ok;
                    expect( user ).to.have.property( 'id' ).and.be.ok;

                    gUser = user;

                    done();
                }, done );
        });

        it( 'should return gUser if UserService is not defined', function ( done ) {
            var profile = {
                _json: {
                    id: '112064034597570891032',
                    email: 'volodymyr2m@clevertech.biz',
                    name: 'Volodymyr Denokov',
                    html_url: 'https://github.com/denshikov-vovan',
                    location: 'Ukraine',
                    avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                }
            };

            if ( !UserService ) {
                Service
                    .authenticate( gUser, profile )
                    .then( function ( user ) {

                        expect( !UserService ).to.be.true;

                        expect( user ).to.be.an( 'object' ).and.be.ok;
                        expect( user ).to.have.property( 'id' ).and.equal( gUser.id );
                        expect( user ).to.have.property( 'token' ).and.be.ok;
                        expect( user ).to.have.property( 'firstname' ).and.equal( gUser.firstname );
                        expect( user ).to.have.property( 'lastname' ).and.equal( gUser.lastname );
                        expect( user ).to.have.property( 'email' ).and.equal( gUser.email );
                        expect( user ).to.have.property( 'githubid' ).and.equal( gUser.githubid );
                        expect( user ).to.have.property( 'accessedAt' ).and.be.ok;

                        done();
                    } )
                    .fail( done );
            } else {
                console.log( 'UserService is defined' );
                done();
            }
        } );

        it( 'should create new user and to associate it with qUser if UserService is defined', function ( done ) {
            var profile = {
                _json: {
                    id: '112064034597570891032',
                    email: 'volodymyr1m@clevertech.biz',
                    name: 'Volodymyr',
                    html_url: 'https://github.com/denshikov-vovan',
                    location: 'Ukraine',
                    avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                }
            };

            if ( !!UserService ) {

                var spy = sinon.spy( UserService, 'create' );

                Service
                    .authenticate( gUser, profile )
                    .then( function ( user ) {

                        expect( !!UserService ).to.be.true;

                        expect( user ).to.be.an( 'object' ).and.be.ok;
                        expect( user ).to.have.property( 'id' ).and.not.equal( gUser.id );

                        expect( spy.called ).to.be.true;
                        expect( spy.calledOnce ).to.be.true;

                        spy.restore();

                        UserService
                            .findById( user.id )
                            .then( function( _user ) {

                                expect( _user ).to.be.an( 'object' ).and.be.ok;
                                expect( _user ).to.have.property( 'id' ).and.equal( user.id );
                                expect( _user ).to.have.property( 'email' ).and.equal( profile._json.email );
                                expect( _user ).to.have.property( 'password' ).and.be.ok;
                                expect( _user ).to.have.property( 'firstname' ).and.equal( 'Volodymyr' );
                                expect( _user ).to.have.property( 'lastname' ).and.be.null;
                                expect( _user ).to.have.property( 'confirmed' ).and.equal( true );
                                expect( _user ).to.have.property( 'active' ).and.equal( true );

                                user_1 = _user;

                                Service
                                    .find( { where: { id: gUser.id } } )
                                    .then( function( _gUser ) {

                                        expect( _gUser ).to.be.an( 'array' ).and.have.length( 1 );

                                        _gUser = _gUser[0];

                                        expect( _gUser ).to.be.an( 'object' ).and.be.ok;
                                        expect( _gUser ).to.have.property( 'id' ).and.equal( gUser.id );
                                        expect( _gUser ).to.have.property( 'UserId' ).and.equal( user.id );

                                        done();
                                    }, done )
                            }, done );
                    } )
                    .fail( done );
            } else {
                console.log( 'UserService is not defined' );
                done();
            }

        } );

        it( 'should return existing user by gUser.UserId if UserService is defined', function ( done ) {
            var profile = {
                _json: {
                    id: '112064034597570891032',
                    email: 'volodymyr21m@clevertech.biz',
                    name: 'Volodymyr',
                    html_url: 'https://github.com/denshikov-vovan',
                    location: 'Ukraine',
                    avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                }
            };

            if ( !!UserService ) {

                var spy = sinon.spy( UserService, 'create' );

                Service
                    .authenticate( gUser, profile )
                    .then( function ( user ) {

                        expect( !!UserService ).to.be.true;

                        expect( user ).to.be.an( 'object' ).and.be.ok;
                        expect( user ).to.have.property( 'id' ).and.equal( user_1.id );

                        expect( spy.called ).to.be.false;

                        spy.restore();

                        done();
                    } )
                    .fail( done );
            } else {
                console.log( 'UserService is not defined' );
                done();
            }

        } );

        it( 'should return error if user with such gUser.UserId do not exist and if UserService is defined' , function ( done ) {
            var profile = {
                _json: {
                    id: '112064034597570891032',
                    email: 'volodymyrm@clevertech.biz',
                    name: 'Volodymyr',
                    html_url: 'https://github.com/denshikov-vovan',
                    location: 'Ukraine',
                    avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                }
            };

            if ( !!UserService ) {

                var spy = sinon.spy( UserService, 'create' );

                gUser
                    .updateAttributes( { UserId: 1000 } )
                    .success( function( result ) {

                        expect( result ).to.be.an( 'object' ).and.be.ok;
                        expect( result ).to.have.property( 'UserId' ).and.equal( 1000 );

                        Service
                            .authenticate( gUser, profile )
                            .then( function ( user ) {

                                expect( !!UserService ).to.be.true;

                                expect( user ).to.be.an( 'object' ).and.be.ok;
                                expect( user ).to.have.property( 'statuscode' ).and.equal( 403 );
                                expect( user ).to.have.property( 'message' ).and.be.ok;

                                expect( spy.called ).to.be.false;

                                spy.restore();

                                done();
                            } )
                            .fail( done );
                    })
                    .error( done );
            } else {
                console.log( 'UserService is not defined' );
                done();
            }

        } );

        it( 'should return existing user by gUser.email if user with such email already exist', function ( done ) {
            var profile = {
                _json: {
                    id: '112064034597570891032',
                    email: 'volodymyrm@clevertech.biz',
                    name: 'Volodymyr',
                    html_url: 'https://github.com/denshikov-vovan',
                    location: 'Ukraine',
                    avatar_url: 'https://gravatar.com/avatar/e98ef168c69fd2a812a8dd46a775072a?d=https%3A%2F%2Fidenticons.github.com%2F814919104a88497c37d2154d918bba97.png&r=x'
                }
            };

            if ( !!UserService ) {

                var spy = sinon.spy( UserService, 'create' );

                gUser
                    .updateAttributes( { UserId: null } )
                    .success( function( result ) {

                        expect( result ).to.be.an( 'object' ).and.be.ok;
                        expect( result ).to.have.property( 'UserId' ).and.equal( null );

                        Service
                            .authenticate( gUser, profile )
                            .then( function ( user ) {

                                expect( !!UserService ).to.be.true;

                                expect( user ).to.be.an( 'object' ).and.be.ok;
                                expect( user ).to.have.property( 'id' ).and.equal( user_1.id );

                                expect( spy.called ).to.be.false;

                                spy.restore();

                                Service
                                    .find( { where: { id: gUser.id } } )
                                    .then( function( _gUser ) {

                                        expect( _gUser ).to.be.an( 'array' ).and.have.length( 1 );

                                        _gUser = _gUser[0];

                                        expect( _gUser ).to.be.an( 'object' ).and.be.ok;
                                        expect( _gUser ).to.have.property( 'id' ).and.equal( gUser.id );
                                        expect( _gUser ).to.have.property( 'UserId' ).and.equal( user.id );

                                        done();
                                    }, done )
                            } )
                            .fail( done );
                    })
                    .error( done );
            } else {
                console.log( 'UserService is not defined' );
                done();
            }

        } );

    } );

    describe( '.updateAccessedDate( user )', function () {

        it( 'should be able to update user', function ( done ) {

            if ( !!UserService ) {

                user_1
                    .updateAttributes( { accessedAt: null } )
                    .success( function( result ) {

                        expect( result ).to.be.an( 'object' ).and.be.ok;
                        expect( result ).to.have.property( 'id' ).and.equal( user_1.id );
                        expect( result ).to.have.property( 'accessedAt' ).and.not.be.ok;

                        Service
                            .updateAccessedDate( user_1 )
                            .then( function( result ) {

                                expect( result ).to.be.an( 'object' ).and.be.ok;
                                expect( result ).to.have.property( 'id' ).and.equal( user_1.id );
                                expect( result ).to.have.property( 'accessedAt' ).and.be.ok;

                                done();
                            }, done );
                    })
                    .error( done );

            } else {
                console.log( 'UserService is not defined' );
                done();
            }
        } );

        it( 'should be able to update gUser', function ( done ) {

            gUser
                .updateAttributes( { accessedAt: null } )
                .success( function( result ) {

                    expect( result ).to.be.an( 'object' ).and.be.ok;
                    expect( result ).to.have.property( 'id' ).and.equal( gUser.id );
                    expect( result ).to.have.property( 'accessedAt' ).and.not.be.ok;

                    Service
                        .updateAccessedDate( gUser )
                        .then( function( result ) {

                            expect( result ).to.be.an( 'object' ).and.be.ok;
                            expect( result ).to.have.property( 'id' ).and.equal( gUser.id );
                            expect( result ).to.have.property( 'accessedAt' ).and.be.ok;

                            done();
                        }, done );
                })
                .error( done );
        } );

        it( 'should be able to get object if it is not a user', function ( done ) {

            Service
                .updateAccessedDate ( { statuscode: 403, message: 'invalid' } )
                .then ( function ( result ) {

                    expect ( result ).to.be.an ( 'object' ).and.be.ok;
                    expect ( result ).to.have.property ( 'statuscode' ).and.equal ( 403 );
                    expect ( result ).to.have.property ( 'message' ).and.be.ok;

                    done ();
                }, done );
        } );

    } );

    describe( '.listUsers()', function () {

        it( 'should be able to get list of all gUsers', function ( done ) {

            Service
                .listUsers()
                .then( function ( users ) {

                    expect( users ).to.be.an( 'array' ).and.have.length.above( 1 );
                    expect( users[0] ).to.be.an( 'object' ).and.be.ok;
                    expect( users[0] ).to.have.property( 'id' ).and.be.ok;
                    expect( users[0] ).to.have.property( 'githubid' ).and.be.ok;
                    expect( users[0] ).to.have.property( 'email' ).and.be.ok;
                    expect( users[0] ).to.have.property( 'locale' ).and.be.ok;
                    expect( users[0] ).to.not.have.property( 'token' );

                    done();
                } )
                .fail( done );
        } );

    } );

    describe( '.findUserById()', function () {

        it( 'should be able to get gUser by Id', function ( done ) {

            Service
                .findUserById( gUser.id )
                .then( function ( gUser ) {

                    expect( gUser ).to.be.an( 'object' ).and.be.ok;
                    expect( gUser ).to.have.property( 'id' ).and.equal( gUser.id );
                    expect( gUser ).to.have.property( 'githubid' ).and.be.ok;
                    expect( gUser ).to.have.property( 'email' ).and.be.ok;
                    expect( gUser ).to.have.property( 'locale' ).and.be.ok;
                    expect( gUser ).to.not.have.property( 'token' );

                    done();
                } )
                .fail( done );
        } );

        it( 'should be able to get the error if the gUser does not exist', function ( done ) {

            Service
                .findUserById( 151515115151515151 )
                .then( function( result ) {

                    expect( result ).to.be.an( 'object' );
                    expect( result ).to.have.property( 'statuscode' ).and.equal( 403 );
                    expect( result ).to.have.property( 'message' ).and.be.ok;

                    done();
                }, done )
        } );

    } );

    describe( '.deleteUser( gUserId )', function () {

        it( 'should be able to get the error if the gUser does not exist', function ( done ) {

            Service
                .deleteUser( 151515115151515151 )
                .then( function( result ) {

                    expect( result ).to.be.an( 'object' );
                    expect( result ).to.have.property( 'statuscode' ).and.equal( 403 );
                    expect( result ).to.have.property( 'message' ).and.be.ok;

                    done();
                }, done )
        } );

        it( 'should be able to delete gUser', function ( done ) {

            Service
                .deleteUser( gUser.id )
                .then( function ( result ) {

                    expect( result ).to.be.an( 'object' );
                    expect( result ).to.have.property( 'statuscode' ).and.equal( 200 );
                    expect( result ).to.have.property( 'message' ).and.be.ok;

                    done();
                } )
                .fail( done );
        } );

    } );

} );