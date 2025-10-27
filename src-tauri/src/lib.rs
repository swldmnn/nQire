mod commands;
 
#[cfg(debug_assertions)]
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools(); // `main` is the first window from tauri.conf.json without an explicit label
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::send_http_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
