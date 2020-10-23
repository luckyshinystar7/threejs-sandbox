import { lutShaderFunctions } from './LUTShaderFunctions.js';

export const LUTShader = {

	defines: {
		USE_3DTEXTURE: 0,
	},

	uniforms: {
		lut: { value: null },
		lutSize: { value: 0 },

		tDiffuse: { value: null },
		intensity: { value: 1.0 },
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

	`,


	fragmentShader: /* glsl */`

		${ lutShaderFunctions }

		#if USE_3DTEXTURE
		uniform sampler3D lut;
		#else
		uniform sampler2D lut;
		uniform float lutSize;
		#endif

		varying vec2 vUv;
		uniform float intensity;
		uniform sampler2D tDiffuse;
		void main() {

			vec4 val = texture2D( tDiffuse, vUv );
			vec4 lutVal;
			#if USE_3DTEXTURE
			lutVal = vec4( texture( tDiffuse, val.rgb ), val.a );
			#else
			lutVal = vec4( lutLookup( lut, lutSize, val.rgb ), val.a );
			#endif
			gl_FragColor = mix( val, lutVal, intensity );

		}

	`,

};
