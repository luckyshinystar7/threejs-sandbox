export const sampleFunctions = `

	vec4 packedTexture2DLOD( sampler2D texture, vec2 uv, int level ) {

		float dimensions = 1.0 / pow( 2.0, float( level ) );
		float scaledWidth = 2.0 / 3.0;
		vec2 scaledDimensions = vec2( scaledWidth * dimensions, dimensions );
		vec2 offset = vec2(
			level > 0 ? scaledWidth : 0.0,
			level > 0 ? 1.0 / pow( 2.0, float( level ) ) : 0.0
		);

		vec2 samplePoint;
		samplePoint.x = mix( offset.x, offset.x + scaledDimensions.x, uv.x );
		samplePoint.y = mix( offset.y, offset.y + scaledDimensions.y, uv.y );

		return texture2D( texture, samplePoint );

	}

	vec4 packedTexture2DLOD( sampler2D texture, vec2 uv, float level ) {

		float ratio = mod( level, 1.0 );
		int minLevel = int( floor( level ) );
		int maxLevel = int( ceil( level ) );

		return mix( packedTexture2DLOD( texture, uv, minLevel ), packedTexture2DLOD( texture, uv, maxLevel ), ratio );

	}

`;
