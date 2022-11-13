<script lang="ts">
	import Auth from '$lib/Auth.svelte';
</script>

<header>
	<h1>Readers</h1>
	<Auth />
</header>

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		h1 {
			margin: 0;
		}
	}
</style>
