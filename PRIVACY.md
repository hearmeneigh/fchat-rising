# Security & Privacy

## General
F-Chat Rising does not collect any personal information about you, your computer, or anything else, other than what is necessary to connect you to F-Chat.

No data about your sessions, chats, characters, passwords, et cetera, is shared with the F-Chat Rising developers.

## Connectivity
F-Chat Rising connects to the following hosts:

  * `f-list.net` – FChat, FList, profiles, character search, authentication, character images, etc.
  * `github.com` – F-Chat Rising [update checks](./electron/pack.js)
  * `easylist.to`, `adblockplus.org`, `adtidy.org`, `githubusercontent.com` – [ad blocker updates](./electron/blocker/blocker.ts)
  * `xariah.net` – [eicon updates](./learn/eicon/updater.ts)

Your character name, password, messages, and any other private data is only sent to `f-list.net`; the other services are queried anonymously.
Your IP address will be exposed to all of these services.

## Link Previews
When the 'Link Preview' feature is used, F-Chat Rising will connect to the URL being previewed and any other hosts that are linked from the page being previewed.

* F-Chat Rising uses [@cliqz/adblocker](https://github.com/ghostery/adblocker) to block as many ads and trackers as possible.
* Using the Link Preview feature will expose you to similar risks that opening a link in your web browser does.
* If you are concerned about your security or privacy, consider disabling the link preview feature in F-Chat Rising settings.
* In some cases F-Chat Rising uses 'proxy services' that help formatting Link Previews. For example:
  * Twitter previews are proxied through `api.fxtwitter.com`
  * YouTube previews are proxied through `yewtu.be`

## Locally Stored Data
F-Chat Rising stores data on your computer. This data contains conversation logs, settings, cache, and other
information such as custom dictionary words. By default, the data is stored in:

| **Operating System** | **Data Path**                         |
|:---------------------|:--------------------------------------|
| Windows              | `%AppData%\fchat`                     |
| MacOS                | `~/Library/Application Support/fchat` |
| Linux                | `~/.config/fchat`                     |

F-List account usernames and passwords are stored in a secure datastore provided by your operating system.
For more information, see [electron safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage).
