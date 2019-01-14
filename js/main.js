
var previousProject = document.querySelector('.current'),
    firstProject = document.querySelector('.projects>:first-child');

var nbrs = document.querySelectorAll('.nbr-work');

//init first project
firstProject.classList.add('current');


nbrs.forEach(function(n) {
  n.addEventListener('click', function(event) {
    nbrs.forEach(function(elt) {
      elt.classList.remove('active');
    });
    //_removeClasses();
    event.target.classList.add('active');
    previousProject.classList.remove('current');
    var targetProject = document.querySelector(n.dataset.target);
    targetProject.classList.add('current');
    previousProject = targetProject;
  });
})
