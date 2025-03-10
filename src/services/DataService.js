
class DataService {
    constructor() {
        this.data = [];
        this.loaded = false;
    }

    async loadData() {
        if (this.loaded) return;
        try {
            const response = await fetch("https://cdn.budidev.de/24076");
            if (!response.ok) throw new Error("Failed to fetch data");
            this.data = await response.json();
            console.log(this.data);
            this.loaded = true;
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    getData() {
        return this.data;
    }
}

const dataService = new DataService();

export default dataService;
