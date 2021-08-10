import { ShaderLib, UniformsUtils, Vector2, Color } from '//cdn.skypack.dev/three@0.130.1/build/three.module.js';

// need to unpack depth backt to world space to get thickness
// https://stackoverflow.com/questions/44121266/compute-3d-point-from-mouse-position-and-depth-map
export const TranslucentShader = {
	extensions: {
		fragDepth: true,
	},
	vertexShader: `
		void main() {

			#include <begin_vertex>
			#include <project_vertex>

		}
	`,
	fragmentShader: `
		uniform sampler2D frontLayerTexture;
		uniform sampler2D backLayerTexture;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform float absorptionFactor;
		uniform vec3 color;

		#define DITHERING 1
		#include <packing>
		#include <common>
		#include <dithering_pars_fragment>

		float convertDepth( float fragCoordZ ) {

			float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
			return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

		}

		void main() {

			vec2 uv = gl_FragCoord.xy / resolution;

			float frontDepth = texture2D( frontLayerTexture, uv ).r;
			float backDepth = texture2D( backLayerTexture, uv ).r;
			float thickness = convertDepth( frontDepth ) - convertDepth( backDepth );

			vec3 absorbed = vec3( 1.0 ) - clamp( color, 0.0, 1.0 );
			vec3 val = dithering( - absorbed * thickness * 1000.0 * absorptionFactor );
			gl_FragColor.rgb = val;
			gl_FragColor.a = - thickness;

		}

	`,
	defines: {},
	uniforms: UniformsUtils.merge( [
		{
			frontLayerTexture: { value: null },
			backLayerTexture: { value: null },

			absorptionFactor: { value: 1.0 },
			color: { value: new Color() },
			cameraNear: { value: 0.0 },
			cameraFar: { value: 0.0 },
			resolution: { value: new Vector2() },
		},
		UniformsUtils.clone( ShaderLib.physical.uniforms )
	] ),
};

