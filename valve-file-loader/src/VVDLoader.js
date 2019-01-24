// VVD: https://developer.valvesoftware.com/wiki/VVD

THREE.VVDLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.VVDLoader.prototype = {

	constructor: THREE.VVDLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	parse: function ( buffer ) {

		// https://github.com/ValveSoftware/source-sdk-2013/blob/0d8dceea4310fde5706b3ce1c70609d72a38efdf/sp/src/public/studio.h#L398
		const MAX_NUM_LODS = 8;
		const MAX_NUM_BONES_PER_VERT = 3;

		function parseHeader( buffer ) {

			var dataView = new DataView( buffer );
			var i = 0;

			// int
			var id = dataView.getInt32( i, true );
			i += 4;

			// int
			var version = dataView.getInt32( i, true );
			i += 4;

			// long
			var checksum = dataView.getInt32( i, true );
			i += 4;

			// int
			var numLODs = dataView.getUint32( i, true );
			i += 4;

			// int
			var numLODVertexes = [];
			for ( var j = 0; j < MAX_NUM_LODS; j ++ ) {

				numLODVertexes.push( dataView.getInt32( i, true ) );
				i += 4;

			}

			// int
			var numFixups = dataView.getInt32( i, true );
			i += 4;

			// int
			var fixupTableStart = dataView.getInt32( i, true );
			i += 4;

			// int
			var vertexDataStart = dataView.getInt32( i, true );
			i += 4;

			// int
			var tangentDataStart = dataView.getInt32( i, true );
			i += 4;

			return {
				id,
				version,
				checksum,
				numLODs,
				numLODVertexes,
				numFixups,
				fixupTableStart,
				vertexDataStart,
				tangentDataStart,
				buffer
			};

		}

		function parseFixups( buffer, numFixups, fixupTableStart ) {

			var dataView = new DataView( buffer );
			var offset = fixupTableStart;
			var res = [];
			for ( var i = 0; i < numFixups; i ++ ) {

				var fixup = {};
				fixup.lod = dataView.getInt32( offset + 0, true );
				fixup.sourceVertexID = dataView.getInt32( offset + 4, true );
				fixup.numVertexes = dataView.getInt32( offset + 8, true );
				offset += 12;

				res.push( fixup );

			}

			return res;

		}

		var header = parseHeader( buffer );
		var fixups = parseFixups( buffer, header.numFixups, header.fixupTableStart );

		return { header, fixups, buffer };

	}

};