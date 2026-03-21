#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
int countDigits(const char *str){
//@STUDENT:ADD YOUR CODE FOR FUNCTION HERE:	
  int count = 0;
  for (int i = 0; str[i] != '\0'; i++) {
    if (isdigit((unsigned char)str[i])) {
      count++;
    }
  }

  // Fixed Do not edit anything here.	
  return count;
}
int main() {
  system("cls");
  //INPUT - @STUDENT:ADD YOUR CODE FOR INPUT HERE:
  char str[256];
  if (fgets(str, sizeof(str), stdin) == NULL) {
    str[0] = '\0';
  }

  // Fixed Do not edit anything here.
  printf("\nOUTPUT:\n");
  //@STUDENT: WRITE YOUR OUTPUT HERE:
  printf("%d", countDigits(str));

  //--FIXED PART - DO NOT EDIT ANY THINGS HERE
  printf("\n");
  system ("pause");
  return(0);
}
