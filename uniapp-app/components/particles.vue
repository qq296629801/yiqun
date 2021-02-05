<template>
	<view>
		<div class="spawn"></div>
		<div class="particles"></div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.spawn {
		width: 100vw;
		height: 100vh;
	}
	.particles {
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}
	.particleParent {
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		position: absolute;
		pointer-events: none;
		-webkit-perspective: 200px;
		perspective: 200px;
		-webkit-perspective-origin: 50% 50%;
		perspective-origin: 50% 50%;
	}
	.particle {
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		position: relative;
		-webkit-animation: moveaway;
		animation: moveaway;
		-webkit-animation-duration: 6s;
		animation-duration: 6s;
		-webkit-animation-timing-function: ease-out;
		animation-timing-function: ease-out;
		width: 4px;
		height: 4px;
		background-color: white;
	}
	@-webkit-keyframes moveaway {
		0% {
			opacity: 1;
		}
		100% {
			-webkit-transform: translateX(100vw) rotateX(1080deg) rotateY(720deg) rotateZ(-360deg);
			transform: translateX(100vw) rotateX(1080deg) rotateY(720deg) rotateZ(-360deg);
			/*    width: 100px;
            height: 100px;*/

			opacity: 0;
		}
	}
	@keyframes moveaway {
		0% {
			opacity: 1;
		}
		100% {
			-webkit-transform: translateX(100vw) rotateX(1080deg) rotateY(720deg) rotateZ(-360deg);
			transform: translateX(100vw) rotateX(1080deg) rotateY(720deg) rotateZ(-360deg);
			/*    width: 100px;
            height: 100px;*/

			opacity: 0;
		}
	}
</style>
