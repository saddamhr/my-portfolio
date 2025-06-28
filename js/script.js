function myFunction() {
  var x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

document
  .getElementById('contact-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('thank-you-message').style.display = 'block';
  });

// Theme switcher logic
const themeSwitcher = document.getElementById('theme-switcher');
const body = document.body;

// Load theme preference from local storage or set default to light-mode
let currentTheme = localStorage.getItem('theme');
if (!currentTheme) {
  currentTheme = 'light-mode';
  localStorage.setItem('theme', currentTheme);
}
body.classList.add(currentTheme);

// Set initial icon based on current theme
if (currentTheme === 'dark-mode') {
  themeSwitcher.querySelector('i').classList.remove('fa-moon-o');
  themeSwitcher.querySelector('i').classList.add('fa-sun-o');
} else {
  themeSwitcher.querySelector('i').classList.remove('fa-sun-o');
  themeSwitcher.querySelector('i').classList.add('fa-moon-o');
}

themeSwitcher.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  let theme = 'light-mode';
  if (body.classList.contains('dark-mode')) {
    theme = 'dark-mode';
    themeSwitcher.querySelector('i').classList.remove('fa-moon-o');
    themeSwitcher.querySelector('i').classList.add('fa-sun-o');
  } else {
    themeSwitcher.querySelector('i').classList.remove('fa-sun-o');
    themeSwitcher.querySelector('i').classList.add('fa-moon-o');
  }
  localStorage.setItem('theme', theme);
});

// Dynamic content loading
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then((response) => response.json())
    .then((data) => {
      // Populate Header
      const header = document.getElementById('dynamic-header');
      header.innerHTML = `
                <img src="${data.personalInfo.profilePic}" alt="Profile Picture" class="profile-pic">
                <h1>${data.personalInfo.name}</h1>
                <p>${data.personalInfo.title}</p>
                <a href="${data.personalInfo.cvDownloadLink}" download="${data.personalInfo.name.replace(/ /g, '_')}_CV.pdf" class="download-button">Download CV (PDF)</a>
            `;

      // Populate About Me
      document.getElementById('about-content').textContent =
        data.personalInfo.aboutMe;

      // Populate Skills
      const skillsList = document.getElementById('skills-list');
      data.skills.forEach((skill) => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
      });

      // Populate Experience
      const experienceSection = document.getElementById('experience');
      data.experience.forEach((exp) => {
        const expItem = document.createElement('div');
        expItem.classList.add('experience-item');
        expItem.innerHTML = `
                    <h3>${exp.title}</h3>
                    <p class="item-meta">${exp.company} | ${exp.duration}</p>
                    <ul>
                        ${exp.responsibilities.map((resp) => `<li>${resp}</li>`).join('')}
                    </ul>
                `;
        experienceSection.appendChild(expItem);
      });

      // Populate Projects
      const projectsSection = document.getElementById('projects');
      data.projects.forEach((project) => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        projectItem.innerHTML = `
                    <h3>${project.title}</h3>
                    <p class="item-meta"><a href="${project.link}" target="_blank">Live link</a></p>
                    <p>${project.description}</p>
                `;
        projectsSection.appendChild(projectItem);
      });

      // Populate Education
      const educationSection = document.getElementById('education');
      data.education.forEach((edu) => {
        const eduItem = document.createElement('div');
        eduItem.classList.add('education-item');
        eduItem.innerHTML = `
                    <h3>${edu.degree}</h3>
                    <p class="item-meta">${edu.institution} | ${edu.year}</p>
                    ${edu.details.map((detail) => `<p>${detail}</p>`).join('')}
                `;
        educationSection.appendChild(eduItem);
      });

      // Populate Social Links
      const socialIconsContainer = document.querySelector(
        '#find-me-online .social-icons'
      );
      data.socialLinks.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.classList.add('social-icon');
        a.setAttribute('aria-label', link.name);
        a.innerHTML = `<i class="fa ${link.icon}"></i>`;
        socialIconsContainer.appendChild(a);
      });

      // Populate Footer
      document.getElementById('current-year').textContent =
        new Date().getFullYear();
      document.getElementById('footer-name').textContent =
        data.personalInfo.name;
    })
    .catch((error) => console.error('Error loading CV data:', error));
});
