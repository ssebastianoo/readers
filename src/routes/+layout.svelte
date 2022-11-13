<script>
	import './global.scss';
	import Header from '$lib/Header.svelte';
</script>

<div class="container">
	<Header />
	<main>
		<slot />
	</main>
</div>

<style lang="scss">
	.container {
		padding: 20px;
	}
</style>
