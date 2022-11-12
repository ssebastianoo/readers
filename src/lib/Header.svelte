<script lang="ts">
    import Auth from "$lib/Auth.svelte";
</script>

<header>
	<nav>
		<div class="nav-item">
			<a href="/">Home</a>
		</div>
		<Auth />
	</nav>
</header>

<style lang="scss">
	nav {
		display: flex;
		gap: 20px;
		padding: 20px;
	}
</style>
