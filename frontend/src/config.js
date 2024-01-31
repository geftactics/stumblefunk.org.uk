async function config() {
  try {
    const response = await fetch('config.json');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error; 
  }
}

export default config;