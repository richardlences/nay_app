<script setup>

import { reactive, ref } from "vue";


async function fetchCategories() {
    const data = await fetch("http://localhost:3000/categories");
    categories = await data.json();
    loadingCategories.value = false;
}

async function fetchProducts(mode, category, page) {
    noProducts.value = false;
    loadingProducts.value = true;
    searchOrCategory.value = mode
    if (mode === "category") {
        currCategory.value = category;
        const data = await fetch(`http://localhost:3000/products?category=${category}&page=${page}`);
        const json = await data.json();
        products.length = 0;
        products.push(...json);
        const res = await fetch(`http://localhost:3000/numpages?category=${category}`);
        numPages.value = parseInt(await res.json())
        currPage.value = page
        loadingProducts.value = false
    } else {
        const data = await fetch(`http://localhost:3000/products?search=${lastSearched.value}&page=${page}`);
        const json = await data.json();
        products.length = 0;
        products.push(...json);
        const res = await fetch(`http://localhost:3000/numpages?search=${lastSearched.value}`);
        numPages.value = parseInt(await res.json());
        currPage.value = numPages.value ? page : 0;
        loadingProducts.value = false
    }
    if (!products.length) {
        noProductsFound.value = true
    } else {
        noProductsFound.value = false
    }
}

async function changePage(where) {
    if (where) {
        if (searchOrCategory.value === "search") {
            fetchProducts("search", 0, currPage.value + 1);
        } else {
            fetchProducts("category", currCategory.value, currPage.value + 1)
        }
    } else {
        if (searchOrCategory.value === "search") {
            fetchProducts("search", 0, currPage.value - 1);
        } else {
            fetchProducts("category", currCategory.value, currPage.value - 1)
        }
    }
}

async function search() {
    if (searchText.value) {
        searchOrCategory.value = "search";
        lastSearched.value = searchText.value;
        searchText.value = "";
        fetchProducts("search", null, 1);
    }
    console.log("searched");
}

let categories;
const noProductsFound = ref(false);
const searchOrCategory = ref("");
const currCategory = ref("");
const numPages = ref(0);
const currPage = ref(1);
const products = reactive([]);
const loadingCategories = ref(true);
const noProducts = ref(true);
const loadingProducts = ref(false);
const lastSearched = ref("");
const searchText = ref("");
fetchCategories()

</script>

<template>

    <div class="antialiased bg-gray-50 dark:bg-gray-900">
        <aside
            class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidenav" id="drawer-navigation">
            <div class="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                <ul class="space-y-2" v-if="!loadingCategories">
                    <li v-for="category in categories">
                        <a class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                            @click="fetchProducts('category', category, 1)">
                            <span class="ml-3">{{ category }}</span>
                        </a>
                    </li>
                </ul>
                <div class="h-full flex items-center justify-center" v-else>
                    <div role="status" class="">
                        <svg aria-hidden="true"
                            class="inline w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </aside>

        <main class=" md:ml-64 h-screen ">
            <div class="p-5 max-w-md mx-auto" @keyup.enter="search">
                <label for="default-search"
                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input v-model="searchText"
                        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Products" />
                    <a @click="search"
                        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">Search</a>
                </div>
            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg"
                v-if="!noProducts && !loadingProducts && !noProductsFound">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                            v-for="product in products">
                            <th scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ product.name }}
                            </th>
                            <td class="px-6 py-4">
                                {{ product.price }}€
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else-if="loadingProducts" class="pt-10 flex justify-center w-full">
                <div role="status" class="">
                    <svg aria-hidden="true"
                        class="inline w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-else-if="!noProductsFound" class="pt-10">
                <h1 class="dark:text-white text-center text-5xl font-bold">Select a category or search</h1>
            </div>
            <div v-if="noProductsFound" class="pt-10">
                <h1 class="dark:text-white text-center text-5xl font-bold">No products were found</h1>
            </div>
            <div class="flex justify-center dark:bg-gray-900">
                <a v-if="currPage > 1 && !noProducts && !loadingProducts" @click="changePage(0)"
                    class="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer">
                    <svg class="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    Previous
                </a>
                <a v-if="currPage < numPages && !noProducts && !loadingProducts" @click="changePage(1)"
                    class="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer">
                    Next
                    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </div>
        </main>
    </div>

</template>

<style scoped></style>