<template>
    <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
        <v-container>
            <h1 class="linear-wipe">No content available <br>at this time</h1>
        </v-container>
    </div>
</template>

<style scoped>
.linear-wipe {
    --bg-size: 400%;
    font-weight: bold;
    background: linear-gradient(90deg,
            var(--secondary-purple),
            var(--secondary-blue),
            var(--secondary-purple)) 0 0 / var(--bg-size) 100%;
    color: transparent;
    background-clip: text;
}

@media (prefers-reduced-motion: no-preference) {
    .linear-wipe {
        animation: move-bg 8s linear infinite;
    }

    @keyframes move-bg {
        to {
            background-position: var(--bg-size) 0;
        }
    }
}

h1 {
    font-size: 5rem;
}
</style>