import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.scss']
})
export class CliComponent implements OnInit {
  public cliLog: string;
  public cliValue: string;
  private history: Array<string> = [];
  private lastAttachedHistoryNumber: number;

  private version = 'cli-gui@0.0.0 <a href="https://github.com/kyoyababa/cli-gui" target="_blank">https://github.com/kyoyababa/cli-gui</a>';

  private primaryCommand = 'cli-gui';
  private commandList = [
    {
      code: 'clear',
      alias: '-c',
      options: [],
      desc: 'clear log'
    }, {
      code: 'help',
      alias: '-h',
      options: [],
      desc: 'quick help on all &lt;command&gt'
    }, {
      code: 'cats',
      alias: '-l',
      options: ['--country', '--sortBy'],
      desc: 'list cat types'
    }, {
      code: 'version',
      alias: '-v',
      options: [],
      desc: 'see version of this service'
    }
  ];

  private cats = [
    {name: "American curl", country: "USA"}, {name: "American short hair", country: "USA"}, {name: "American wire hair", country: "USA"}, {name: "exotic short hair", country: "USA"}, {name: "Egyptian Mau", country: "Egypt"}, {name: "oriental short hair", country: "Britain"}, {name: "Oriental Long Hair", country: "United States"}, {name: "Kaomanie", country: "Thailand"}, {name: "Kimlick", country: "Canada"}, {name: "Kriel Bobtail", country: "Russia"}, {name: "Savannah", country: "USA"}, {name: "Korat", country: "Thai"}, {name: "Cyberian", country: "Russia"}, {name: "Japan Bobtail", country: "Japan"}, {name: "Siam", country: "Thailand"}, {name: "Chartreuse", country: "France"}, {name: "Singapura", country: "Singapole"}, {name: "Scotch Fold", country: "United Kingdom"}, {name: "Snowshoeing", country: "USA"}, {name: "Sphinx", country: "Canada"}, {name: "Serengeti", country: "United States"}, {name: "Sockeye", country: "Kenya"}, {name: "Somali", country: "Canada"}
  ];


  ngOnInit() {
    this.initializePre();
    this.initializeValue();
    this.focus();
    this.initializeKeyDowns();
  }


  private initializePre(): void {
    this.cliLog = `Last login: ${this.generateDateString()}${this.getHelp()}`;
  }


  private generateDateString(): string {
    const now = new Date();
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()];
    const time = `00${now.getHours()}`.slice(-2) + ':' + `00${now.getMinutes()}`.slice(-2) + ':' + `00${now.getSeconds()}`.slice(-2);

    return `${day} ${month} ${now.getDate()} ${time}`;
  }


  private getHelp(): string {
    return `

&nbsp;&nbsp;Usage: ${this.primaryCommand} &lt;command&gt;

&nbsp;&nbsp;where &lt;command&gt; is one of:
&nbsp;&nbsp;&nbsp;&nbsp;${this.commandList.map(cmd => cmd.code).join(', ')}

&nbsp;&nbsp;${this.primaryCommand} help : quick help on all &lt;command&gt;

&nbsp;&nbsp;example usage:
&nbsp;&nbsp;&nbsp;&nbsp;${this.primaryCommand} help

&nbsp;&nbsp;${this.version}`;
  }


  private initializeValue(): void {
    this.cliValue = '';
  }


  private initializeKeyDowns(): void {
    document.onkeydown = (e) => {
      const keyCode = e.keyCode;

      let targetHistoryIndex: number;

      if (keyCode === 38 && this.history.length > 0) {
        if (!this.lastAttachedHistoryNumber && this.lastAttachedHistoryNumber !== 0) {
          targetHistoryIndex = this.history.length - 1;
        } else {
          targetHistoryIndex = this.lastAttachedHistoryNumber - 1;
        }

      } else if (keyCode === 40 && this.history.length > 0) {
        if (!this.lastAttachedHistoryNumber && this.lastAttachedHistoryNumber !== 0) {
          targetHistoryIndex = 0;
        } else {
          targetHistoryIndex = this.lastAttachedHistoryNumber + 1;
        }
      }

      if (typeof targetHistoryIndex !== 'undefined') {
        this.cliValue = '';
        this.focus();
        this.cliValue = this.history[targetHistoryIndex];
        this.lastAttachedHistoryNumber = targetHistoryIndex;
      }
    }
  }


  public focus(): void {
    if (window.getSelection().toString()) return;

    document.getElementById('jsi-cliValue').focus();
  }


  public fetchingForScrolling(): void {
    if (window.getSelection().toString()) return;

    document.getElementById('jsi-cliLog').scrollTop = Number.MAX_SAFE_INTEGER;
  }


  public addLog(): void {
    this.cliLog += `

<span>-(cli-gui)</span> : ${this.generateDateString()}
<span>$</span> ${this.cliValue}`;

    this.analyzeInput(this.cliValue);

    this.history.push(this.cliValue);
    this.lastAttachedHistoryNumber = null;
    this.initializeValue();
  }


  private analyzeInput(value: string): void {
    const commands = value.trim().split(' ').filter(val => val !== '');

    if (commands.length === 0) return;

    if (commands[0] === 'cli-gui' && commands.length > 0) {
      this.do(commands);
    } else {
      this.cliLog += `

&nbsp;&nbsp;<em>command ${commands[0]} is not found.</em>`;
    }
  }


  private do(commands: Array<string>): void {
    const getCurrentCommand = () => {
      const command = this.commandList.find(cmd => cmd.alias === commands[1]);
      const official = command ? command.code : null;
      return `<span>${official || commands[1]}</span>`;
    }

    switch (commands[1]) {

      case 'clear':
      case '-c': {
        this.cliLog = '';
        this.initializeValue();
      } break;

      case 'help':
      case '-h': {
        let list: string = '';
        for (let i = 0; i < this.commandList.length; i++) {
          const cmd = this.commandList[i];

          list += `&nbsp;&nbsp;<a>${cmd.code}</a> | <a>${cmd.alias}</a>
&nbsp;&nbsp;&nbsp;&nbsp;options: ${cmd.options.length > 0 ? '&lt;' + cmd.options.join('&gt; &lt;') + '&gt' : ''}
&nbsp;&nbsp;&nbsp;&nbsp;${cmd.desc}
`;
        }

        this.cliLog += `${this.getHelp()}

${list}`;
      } break;

      case 'cats':
      case '-l': {
        let targetCats = this.cats;

        for (let i = 2; i < commands.length - 2; i++) {
          switch (commands[i]) {
            case '--country':
              if (!commands[i + 1]) {
                this.cliLog += `

&nbsp;&nbsp;<em>'country' filter must be supplied an argument.</em>`;
                return;
              }

              targetCats = targetCats.filter(cat => cat.country.toLowerCase() === commands[i + 1].toLowerCase());
              break;

            case '--sortBy':
              if (commands[i + 1] !== 'ASC' && commands[i + 1] !== 'DESC') {
                this.cliLog += `

&nbsp;&nbsp;<em>'sortBy' must be supplied an argument 'ASC' || 'DESC'.</em>`;
              }

              targetCats = targetCats.sort((a, b): any => {
                switch(commands[i + 1]) {
                  case 'ASC': return a.name < b.name;
                  case 'DESC': return a.name > b.name;
                }
              });
              break;
          }
        }

        let log = '';
        for (let i = 0; i < targetCats.length; i++) {
          log += `
&nbsp;&nbsp;<span>${targetCats[i].name}</span> : ${targetCats[i].country}`;
        }

        log += `
&nbsp;&nbsp;${targetCats.length} cat${targetCats.length > 1 ? 's' : ''} found.`;

        this.cliLog += `
${log}`;
      } break;

      case 'version':
      case '-v': {
        this.cliLog += `

&nbsp;&nbsp;${this.version}`;
      } break;

      default: {
        if (commands[1]) {
          this.cliLog += `

  &nbsp;&nbsp;<em>command ${commands[1]} is not defined.</em>`;
        } else {
          this.cliLog += `

  &nbsp;&nbsp;<em>argument(s) must be supplied.</em>`;
        }
      } break;
    }
  }
}
