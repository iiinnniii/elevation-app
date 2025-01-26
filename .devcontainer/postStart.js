import { execSync } from 'child_process';

// Helper function to run shell commands and log output
function runCommand(command, successMessage, errorMessage) {
	try {
		execSync(command, { stdio: 'inherit' });
		if (successMessage) {
			console.log(successMessage);
		}
	} catch (error) {
		switch (errorMessage) {
			case null: {
				break;
			}
			case undefined: {
				console.error(error);
				break;
			}
			default: {
				console.error(errorMessage);
				break;
			}
		}
	}
}

console.log('Starting postStart tasks...');

// 1. Configure git settings
runCommand(
	'git config --global core.autocrlf input',
	'Git config completed successfully',
	'Git config failed',
);

// 2. Install dependencies if `pnpm-lock.yaml` exists
runCommand(
	'if [ -f pnpm-lock.yaml ]; then pnpm install; else echo "pnpm-lock.yaml not found, skipping pnpm install"; fi',
	'pnpm install completed successfully',
	'pnpm install failed',
);

// 3. Handle SSH key copy
runCommand(`
	if [ -f /mnt/ssh_keys/id_rsa ]; then 
		sudo cp /mnt/ssh_keys/id_rsa /root/.ssh && 
		echo "SSH key copied to /root/.ssh/id_rsa"; 
	else 
		echo "SSH key not found, skipping copy";
	fi
`);

// 4. Handle CA certificate copy
runCommand(`
	if [ -f /mnt/ca_certificates/rootCA.crt ]; then 
		sudo cp /mnt/ca_certificates/rootCA.crt /usr/local/share/ca-certificates && 
		echo "CA certificate copied to /usr/local/share/ca-certificates/rootCA.crt" && 
		sudo update-ca-certificates && 
		echo "CA certificate updated"; 
	else 
		echo "CA certificate not found, skipping copy"; 
	fi
`);

// 5. Run pnpm outdated to check for outdated dependencies
runCommand('pnpm outdated', 'pnpm outdated completed', null);
